import React, { useEffect, useState } from "react";
import { mockRepos, profile } from "../mock";
import { Star, GitFork, ExternalLink, Github } from "lucide-react";
import { fetchRepos } from "../lib/api";

const languageDot = {
  Python: "#4584b6",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SQL: "#dad8d8",
  Java: "#b07219",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
};

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(iso));
  } catch { return ""; }
};

const RepoCard = ({ repo }) => {
  const dotColor = languageDot[repo.language] || "var(--muted)";
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      data-cursor="hover"
      aria-label={`Open repository ${repo.name} on GitHub`}
      className="group flex flex-col p-5 border border-[var(--line)] surface-2 lift"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Github size={14} className="flex-shrink-0" />
          <span className="font-display text-[14.5px] font-medium tracking-tight truncate">{repo.name}</span>
        </div>
        <ExternalLink size={13} className="opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
      <p className="text-[13px] leading-[1.55] text-[var(--muted)] mb-4" style={{ minHeight: "40px" }}>
        {repo.description || "No description provided."}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4" style={{ color: "var(--muted)" }}>
          {repo.topics.slice(0, 4).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between text-[11.5px] font-mono">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} /> {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1"><Star size={11} /> {repo.stargazers_count}</span>
          <span className="flex items-center gap-1"><GitFork size={11} /> {repo.forks_count}</span>
        </div>
        <span className="text-[var(--muted)]">{formatDate(repo.updated_at)}</span>
      </div>
    </a>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col p-5 border border-[var(--line)] surface-2 skel-pulse" aria-hidden="true">
    <div className="h-3.5 w-1/2 mb-3" style={{ background: "var(--line)" }} />
    <div className="h-2.5 w-full mb-1.5" style={{ background: "var(--line)" }} />
    <div className="h-2.5 w-4/5 mb-4" style={{ background: "var(--line)" }} />
    <div className="flex gap-1.5 mb-3">
      <div className="h-4 w-12" style={{ background: "var(--line)" }} />
      <div className="h-4 w-16" style={{ background: "var(--line)" }} />
      <div className="h-4 w-10" style={{ background: "var(--line)" }} />
    </div>
    <div className="flex justify-between mt-auto">
      <div className="h-2.5 w-24" style={{ background: "var(--line)" }} />
      <div className="h-2.5 w-16" style={{ background: "var(--line)" }} />
    </div>
  </div>
);

const GitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchRepos(profile.github, 12);
        if (!alive) return;
        const list = data?.repos || [];
        if (list.length === 0) {
          setRepos(mockRepos);
          setWarn("Showing sample data — GitHub returned 0 public repos.");
        } else {
          setRepos(list);
        }
      } catch (e) {
        if (!alive) return;
        setRepos(mockRepos);
        setWarn("Couldn’t reach GitHub right now — showing sample repos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section id="repos" className="section-pad surface-2 divider-top">
      <div className="container-wide">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="t-subheading mb-4">04 / Open Source</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>Live from</span></span><br />
              <span className="reveal-line"><span><span className="italic-accent font-normal">@{profile.github}</span> on GitHub.</span></span>
            </h2>
          </div>
          <p className="t-body text-[var(--muted)]" style={{ maxWidth: "42ch" }}>
            Auto-syncs with my GitHub. Stars, forks, languages — always up to date.
          </p>
        </div>

        {warn && !loading && (
          <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)] mb-5">
            {warn}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : repos.map((r) => <RepoCard key={r.id} repo={r} />)
          }
        </div>

        <div className="flex justify-center" style={{ marginTop: "40px" }}>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="btn-ghost" data-cursor="hover" aria-label="View full GitHub profile in a new tab">
            View full GitHub profile <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubRepos;
