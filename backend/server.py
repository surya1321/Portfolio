from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import asyncio
import httpx
from datetime import datetime, timezone, timedelta
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ.get("DB_NAME", "test_database")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Portfolio API", version="1.0")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("portfolio")

# ----------------------------- Models -----------------------------

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=500)

    @field_validator("name", "message")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            raise ValueError("must not be empty")
        return v


class ContactMessageResponse(BaseModel):
    id: str
    ok: bool = True
    received_at: datetime


class GitHubRepo(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stargazers_count: int = 0
    forks_count: int = 0
    html_url: str
    updated_at: str
    topics: List[str] = Field(default_factory=list)


class GitHubReposResponse(BaseModel):
    username: str
    count: int
    cached: bool
    repos: List[GitHubRepo]

# ----------------------------- Routes -----------------------------

@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "portfolio-api"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**r) for r in rows]


# --------- Contact ---------

@api_router.post("/contact", response_model=ContactMessageResponse)
async def submit_contact(payload: ContactMessageCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc),
    }
    await db.contact_messages.insert_one(doc)
    logger.info("contact_message_received id=%s email=%s", doc["id"], doc["email"])
    return ContactMessageResponse(
        id=doc["id"], ok=True, received_at=doc["created_at"]
    )


@api_router.get("/contact/messages")
async def list_contact_messages(limit: int = 50):
    """Internal helper to inspect saved messages (returns most recent first)."""
    rows = (
        await db.contact_messages.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    for r in rows:
        if isinstance(r.get("created_at"), datetime):
            r["created_at"] = r["created_at"].isoformat()
    return {"count": len(rows), "messages": rows}


# --------- GitHub Repos (cached) ---------

GITHUB_CACHE_TTL_SECONDS = 600  # 10 minutes


async def _fetch_github_live(username: str) -> List[dict]:
    url = f"https://api.github.com/users/{username}/repos"
    params = {"sort": "updated", "per_page": 100, "type": "owner"}
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "portfolio-api",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    async with httpx.AsyncClient(timeout=12.0) as cli:
        r = await cli.get(url, params=params, headers=headers)

    if r.status_code == 404:
        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
    if r.status_code == 403:
        raise HTTPException(status_code=429, detail="GitHub rate-limit hit")
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"GitHub upstream error ({r.status_code})")

    data = r.json()
    if not isinstance(data, list):
        raise HTTPException(status_code=502, detail="Unexpected GitHub response")
    return data


def _shape_repo(raw: dict) -> dict:
    return {
        "id": int(raw.get("id") or 0),
        "name": raw.get("name") or "",
        "description": raw.get("description"),
        "language": raw.get("language"),
        "stargazers_count": int(raw.get("stargazers_count") or 0),
        "forks_count": int(raw.get("forks_count") or 0),
        "html_url": raw.get("html_url") or "",
        "updated_at": raw.get("updated_at") or "",
        "topics": list(raw.get("topics") or []),
    }


@api_router.get("/github/repos", response_model=GitHubReposResponse)
async def get_github_repos(
    username: str = Query(default="surya1321", min_length=1, max_length=80),
    limit: int = Query(default=12, ge=1, le=50),
    refresh: bool = Query(default=False),
):
    now = datetime.now(timezone.utc)

    # 1. Try cache
    if not refresh:
        cached = await db.github_cache.find_one({"_id": username})
        if cached and cached.get("cached_at"):
            cached_at = cached["cached_at"]
            if cached_at.tzinfo is None:
                cached_at = cached_at.replace(tzinfo=timezone.utc)
            if (now - cached_at) < timedelta(seconds=GITHUB_CACHE_TTL_SECONDS):
                repos = cached.get("repos", [])[:limit]
                return GitHubReposResponse(
                    username=username, count=len(repos), cached=True, repos=repos
                )

    # 2. Live fetch
    raw_list = await _fetch_github_live(username)

    # filter forks and archived
    cleaned = [
        _shape_repo(r)
        for r in raw_list
        if not r.get("fork") and not r.get("archived") and not r.get("private")
    ]
    cleaned.sort(
        key=lambda r: (r["stargazers_count"], r["updated_at"]),
        reverse=True,
    )

    # 3. Update cache
    try:
        await db.github_cache.update_one(
            {"_id": username},
            {"$set": {"repos": cleaned, "cached_at": now}},
            upsert=True,
        )
    except Exception as e:  # noqa: BLE001
        logger.warning("github_cache_write_failed: %s", e)

    repos = cleaned[:limit]
    return GitHubReposResponse(
        username=username, count=len(repos), cached=False, repos=repos
    )


# ----------------------------- Wire up -----------------------------

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
