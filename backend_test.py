#!/usr/bin/env python3
"""
Backend API Test Suite for Portfolio App
Tests all Phase 2 endpoints plus legacy endpoints
"""
import requests
import time
import json
from datetime import datetime

# Load backend URL from frontend .env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=', 1)[1].strip() + '/api'
            break

print(f"Testing backend at: {BASE_URL}\n")
print("=" * 80)

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def test_result(name, passed, message=""):
    """Track test results"""
    if passed:
        test_results["passed"].append(name)
        print(f"✅ PASS: {name}")
        if message:
            print(f"   {message}")
    else:
        test_results["failed"].append(name)
        print(f"❌ FAIL: {name}")
        if message:
            print(f"   {message}")
    print()

def test_warning(name, message):
    """Track warnings"""
    test_results["warnings"].append(name)
    print(f"⚠️  WARNING: {name}")
    print(f"   {message}\n")

# ============================================================================
# TEST 1: Health Check Endpoint
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: Health Check Endpoint (GET /api/health)")
print("=" * 80)

try:
    response = requests.get(f"{BASE_URL}/health", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        expected = {"status": "ok", "service": "portfolio-api"}
        
        if data == expected:
            test_result("Health check endpoint", True, 
                       f"Response: {json.dumps(data)}")
        else:
            test_result("Health check endpoint", False,
                       f"Expected {expected}, got {data}")
    else:
        test_result("Health check endpoint", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("Health check endpoint", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2: GitHub Repos Endpoint (High Priority)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2: GitHub Repos Endpoint (GET /api/github/repos)")
print("=" * 80)

# Test 2a: Basic fetch with default username
print("\n--- Test 2a: Basic fetch (username=surya1321, limit=12) ---")
try:
    response = requests.get(
        f"{BASE_URL}/github/repos",
        params={"username": "surya1321", "limit": 12},
        timeout=15
    )
    
    if response.status_code == 200:
        data = response.json()
        required_keys = ["username", "count", "cached", "repos"]
        
        if all(key in data for key in required_keys):
            if data["username"] == "surya1321":
                if isinstance(data["repos"], list) and len(data["repos"]) > 0:
                    # Check first repo structure
                    repo = data["repos"][0]
                    repo_keys = ["id", "name", "description", "language", 
                                "stargazers_count", "forks_count", "html_url", 
                                "updated_at", "topics"]
                    
                    if all(key in repo for key in repo_keys):
                        test_result("GitHub repos basic fetch", True,
                                   f"Returned {data['count']} repos, cached={data['cached']}")
                        first_call_cached = data["cached"]
                    else:
                        missing = [k for k in repo_keys if k not in repo]
                        test_result("GitHub repos basic fetch", False,
                                   f"Repo missing keys: {missing}")
                else:
                    test_result("GitHub repos basic fetch", False,
                               f"Expected non-empty repos list, got {len(data['repos'])} repos")
            else:
                test_result("GitHub repos basic fetch", False,
                           f"Expected username 'surya1321', got '{data['username']}'")
        else:
            missing = [k for k in required_keys if k not in data]
            test_result("GitHub repos basic fetch", False,
                       f"Response missing keys: {missing}")
    else:
        test_result("GitHub repos basic fetch", False,
                   f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    test_result("GitHub repos basic fetch", False, f"Exception: {str(e)}")

# Test 2b: Cache behavior - second call should be cached
print("\n--- Test 2b: Cache behavior (second call should be cached) ---")
time.sleep(1)  # Small delay
try:
    response = requests.get(
        f"{BASE_URL}/github/repos",
        params={"username": "surya1321", "limit": 12},
        timeout=15
    )
    
    if response.status_code == 200:
        data = response.json()
        if data.get("cached") == True:
            test_result("GitHub repos cache behavior", True,
                       "Second call returned cached=true as expected")
        else:
            # If first call was already cached, we need to test with refresh
            test_warning("GitHub repos cache behavior",
                        "Second call returned cached=false. First call may have been cached already.")
    else:
        test_result("GitHub repos cache behavior", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("GitHub repos cache behavior", False, f"Exception: {str(e)}")

# Test 2c: Refresh parameter bypasses cache
print("\n--- Test 2c: Refresh parameter (should bypass cache) ---")
try:
    response = requests.get(
        f"{BASE_URL}/github/repos",
        params={"username": "surya1321", "refresh": "true"},
        timeout=15
    )
    
    if response.status_code == 200:
        data = response.json()
        if data.get("cached") == False:
            test_result("GitHub repos refresh parameter", True,
                       "refresh=true returned cached=false as expected")
        else:
            test_result("GitHub repos refresh parameter", False,
                       "refresh=true should return cached=false")
    else:
        test_result("GitHub repos refresh parameter", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("GitHub repos refresh parameter", False, f"Exception: {str(e)}")

# Test 2d: Non-existent user returns 404
print("\n--- Test 2d: Non-existent user (should return 404) ---")
try:
    response = requests.get(
        f"{BASE_URL}/github/repos",
        params={"username": "this-user-definitely-does-not-exist-xyz9182", "refresh": "true"},
        timeout=15
    )
    
    if response.status_code == 404:
        test_result("GitHub repos non-existent user", True,
                   "Non-existent user returned 404 as expected")
    else:
        test_result("GitHub repos non-existent user", False,
                   f"Expected 404, got {response.status_code}")
except Exception as e:
    test_result("GitHub repos non-existent user", False, f"Exception: {str(e)}")

# Test 2e: Limit parameter works
print("\n--- Test 2e: Limit parameter (limit=3) ---")
try:
    response = requests.get(
        f"{BASE_URL}/github/repos",
        params={"username": "surya1321", "limit": 3},
        timeout=15
    )
    
    if response.status_code == 200:
        data = response.json()
        if len(data["repos"]) <= 3:
            test_result("GitHub repos limit parameter", True,
                       f"limit=3 returned {len(data['repos'])} repos")
        else:
            test_result("GitHub repos limit parameter", False,
                       f"limit=3 returned {len(data['repos'])} repos (expected ≤3)")
    else:
        test_result("GitHub repos limit parameter", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("GitHub repos limit parameter", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 3: Contact Form Endpoint (High Priority)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: Contact Form Endpoint (POST /api/contact)")
print("=" * 80)

# Test 3a: Valid submission
print("\n--- Test 3a: Valid contact form submission ---")
test_email = f"test-{int(time.time())}@example.com"
try:
    payload = {
        "name": "Test User",
        "email": test_email,
        "message": "Hello, this is a test message from the automated test suite."
    }
    response = requests.post(
        f"{BASE_URL}/contact",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        required_keys = ["id", "ok", "received_at"]
        
        if all(key in data for key in required_keys):
            if data["ok"] == True and isinstance(data["id"], str):
                # Verify it's a valid UUID format
                try:
                    from uuid import UUID
                    UUID(data["id"])
                    # Verify received_at is ISO 8601
                    datetime.fromisoformat(data["received_at"].replace('Z', '+00:00'))
                    test_result("Contact form valid submission", True,
                               f"Submission successful, id={data['id']}")
                    saved_contact_id = data["id"]
                except Exception as e:
                    test_result("Contact form valid submission", False,
                               f"Invalid id or received_at format: {str(e)}")
            else:
                test_result("Contact form valid submission", False,
                           f"Expected ok=true and valid id, got {data}")
        else:
            missing = [k for k in required_keys if k not in data]
            test_result("Contact form valid submission", False,
                       f"Response missing keys: {missing}")
    else:
        test_result("Contact form valid submission", False,
                   f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    test_result("Contact form valid submission", False, f"Exception: {str(e)}")

# Test 3b: Empty/whitespace name
print("\n--- Test 3b: Empty name (should return 422) ---")
try:
    payload = {
        "name": "   ",
        "email": "test@example.com",
        "message": "Test message"
    }
    response = requests.post(
        f"{BASE_URL}/contact",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 422:
        test_result("Contact form empty name validation", True,
                   "Empty name rejected with 422")
    else:
        test_result("Contact form empty name validation", False,
                   f"Expected 422, got {response.status_code}")
except Exception as e:
    test_result("Contact form empty name validation", False, f"Exception: {str(e)}")

# Test 3c: Invalid email
print("\n--- Test 3c: Invalid email (should return 422) ---")
try:
    payload = {
        "name": "Test User",
        "email": "not-an-email",
        "message": "Test message"
    }
    response = requests.post(
        f"{BASE_URL}/contact",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 422:
        test_result("Contact form invalid email validation", True,
                   "Invalid email rejected with 422")
    else:
        test_result("Contact form invalid email validation", False,
                   f"Expected 422, got {response.status_code}")
except Exception as e:
    test_result("Contact form invalid email validation", False, f"Exception: {str(e)}")

# Test 3d: Message exceeding 500 chars
print("\n--- Test 3d: Message exceeding 500 chars (should return 422) ---")
try:
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "x" * 501
    }
    response = requests.post(
        f"{BASE_URL}/contact",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 422:
        test_result("Contact form message length validation", True,
                   "Message >500 chars rejected with 422")
    else:
        test_result("Contact form message length validation", False,
                   f"Expected 422, got {response.status_code}")
except Exception as e:
    test_result("Contact form message length validation", False, f"Exception: {str(e)}")

# Test 3e: Empty message
print("\n--- Test 3e: Empty message (should return 422) ---")
try:
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "   "
    }
    response = requests.post(
        f"{BASE_URL}/contact",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 422:
        test_result("Contact form empty message validation", True,
                   "Empty message rejected with 422")
    else:
        test_result("Contact form empty message validation", False,
                   f"Expected 422, got {response.status_code}")
except Exception as e:
    test_result("Contact form empty message validation", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 4: Contact Messages List Endpoint
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: Contact Messages List (GET /api/contact/messages)")
print("=" * 80)

print("\n--- Test 4a: List messages and verify recent submission ---")
try:
    response = requests.get(
        f"{BASE_URL}/contact/messages",
        params={"limit": 10},
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        
        if "count" in data and "messages" in data:
            if isinstance(data["messages"], list):
                # Check if our test email is in the list
                found = any(msg.get("email") == test_email for msg in data["messages"])
                
                if found:
                    test_result("Contact messages list", True,
                               f"Retrieved {data['count']} messages, test submission found")
                else:
                    test_result("Contact messages list", False,
                               f"Test submission with email {test_email} not found in recent messages")
            else:
                test_result("Contact messages list", False,
                           "messages field is not a list")
        else:
            test_result("Contact messages list", False,
                       "Response missing 'count' or 'messages' keys")
    else:
        test_result("Contact messages list", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("Contact messages list", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 5: Legacy Endpoints (Low Priority)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 5: Legacy Endpoints")
print("=" * 80)

# Test 5a: GET /api/
print("\n--- Test 5a: Root endpoint (GET /api/) ---")
try:
    response = requests.get(f"{BASE_URL}/", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        if data == {"message": "Hello World"}:
            test_result("Legacy root endpoint", True,
                       f"Response: {json.dumps(data)}")
        else:
            test_result("Legacy root endpoint", False,
                       f"Expected {{'message': 'Hello World'}}, got {data}")
    else:
        test_result("Legacy root endpoint", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("Legacy root endpoint", False, f"Exception: {str(e)}")

# Test 5b: POST /api/status
print("\n--- Test 5b: Create status check (POST /api/status) ---")
try:
    payload = {"client_name": "test-client"}
    response = requests.post(
        f"{BASE_URL}/status",
        json=payload,
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        required_keys = ["id", "client_name", "timestamp"]
        
        if all(key in data for key in required_keys):
            if data["client_name"] == "test-client":
                test_result("Legacy POST status", True,
                           f"Status check created with id={data['id']}")
                status_id = data["id"]
            else:
                test_result("Legacy POST status", False,
                           f"Expected client_name='test-client', got '{data['client_name']}'")
        else:
            missing = [k for k in required_keys if k not in data]
            test_result("Legacy POST status", False,
                       f"Response missing keys: {missing}")
    else:
        test_result("Legacy POST status", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("Legacy POST status", False, f"Exception: {str(e)}")

# Test 5c: GET /api/status
print("\n--- Test 5c: List status checks (GET /api/status) ---")
try:
    response = requests.get(f"{BASE_URL}/status", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        if isinstance(data, list):
            if len(data) > 0:
                # Check if our test status is in the list
                found = any(item.get("client_name") == "test-client" for item in data)
                
                if found:
                    test_result("Legacy GET status", True,
                               f"Retrieved {len(data)} status checks, test record found")
                else:
                    test_result("Legacy GET status", False,
                               "Test status check not found in list")
            else:
                test_result("Legacy GET status", False,
                           "Expected non-empty list")
        else:
            test_result("Legacy GET status", False,
                       "Expected list response")
    else:
        test_result("Legacy GET status", False,
                   f"Expected 200, got {response.status_code}")
except Exception as e:
    test_result("Legacy GET status", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"\n✅ PASSED: {len(test_results['passed'])} tests")
for test in test_results['passed']:
    print(f"   - {test}")

if test_results['warnings']:
    print(f"\n⚠️  WARNINGS: {len(test_results['warnings'])} warnings")
    for test in test_results['warnings']:
        print(f"   - {test}")

if test_results['failed']:
    print(f"\n❌ FAILED: {len(test_results['failed'])} tests")
    for test in test_results['failed']:
        print(f"   - {test}")
else:
    print("\n🎉 All tests passed!")

print("\n" + "=" * 80)
