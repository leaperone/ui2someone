#!/usr/bin/env python3
"""Read-only Vercel production deployment metadata for CI preflight."""

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

TOKEN = os.environ.get("VERCEL_TOKEN", "").strip()
TEAM_ID = os.environ.get("ORG_ID", "").strip()
PROJECT_ID = os.environ.get("PROJECT_ID", "").strip()

if not TOKEN or not TEAM_ID or not PROJECT_ID:
    print("error: missing required secret env (VERCEL_TOKEN, ORG_ID, or PROJECT_ID)")
    sys.exit(1)

DEPLOY_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{8,63}$")
SHA_RE = re.compile(r"^[0-9a-f]{40}$")
READY_STATES = {"BUILDING", "ERROR", "INITIALIZING", "QUEUED", "READY", "CANCELED"}
URL_RE = re.compile(
    r"^https://[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+/?$"
)


def api_get(path: str, query: dict[str, str]) -> dict:
    params = urllib.parse.urlencode({**query, "teamId": TEAM_ID})
    url = f"https://api.vercel.com{path}?{params}"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {TOKEN}"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        print(f"http_error: status={exc.code}")
        sys.exit(2)
    except urllib.error.URLError:
        print("http_error: network")
        sys.exit(2)
    return json.loads(body)


def validate_record(record: dict) -> None:
    dep_id = record.get("deploymentId", "")
    ready = record.get("readyState", "")
    url = record.get("publicUrl", "")
    sha = record.get("gitSha", "")
    created = record.get("createdAt", "")
    if not DEPLOY_ID_RE.match(dep_id):
        raise ValueError("invalid deploymentId")
    if ready not in READY_STATES:
        raise ValueError("invalid readyState")
    if not URL_RE.match(url):
        raise ValueError("invalid publicUrl")
    if sha and not SHA_RE.match(sha):
        raise ValueError("invalid gitSha")
    if not isinstance(created, (int, float)) and not (
        isinstance(created, str) and created.isdigit()
    ):
        if not (isinstance(created, str) and len(created) >= 10):
            raise ValueError("invalid createdAt")


def main() -> None:
    deployments = api_get(
        "/v6/deployments",
        {"projectId": PROJECT_ID, "limit": "5", "target": "production"},
    )
    items = deployments.get("deployments") or []
    if not items:
        print("error: no production deployments returned")
        sys.exit(3)

    latest = items[0]
    dep_id = latest.get("uid") or latest.get("id") or ""
    ready = latest.get("readyState") or latest.get("state") or ""
    url = latest.get("url") or ""
    if url and not url.startswith("http"):
        url = f"https://{url}"
    meta = latest.get("meta") or {}
    sha = meta.get("githubCommitSha") or meta.get("gitCommitSha") or ""
    created = latest.get("createdAt") or latest.get("created") or 0

    alias_urls: list[str] = []
    alias_payload = api_get(f"/v2/deployments/{dep_id}/aliases", {})
    for entry in alias_payload.get("aliases") or []:
        alias = entry.get("alias") or entry.get("domain") or ""
        if alias:
            alias_urls.append(f"https://{alias}" if not alias.startswith("http") else alias)

    if not alias_urls:
        alias_list = api_get("/v4/aliases", {"projectId": PROJECT_ID, "limit": "20"})
        for entry in alias_list.get("aliases") or []:
            alias = entry.get("alias") or entry.get("domain") or ""
            if alias:
                alias_urls.append(
                    f"https://{alias}" if not alias.startswith("http") else alias
                )

    alias_urls = sorted({u for u in alias_urls if URL_RE.match(u)})

    record = {
        "deploymentId": dep_id,
        "readyState": ready,
        "publicUrl": url,
        "aliases": alias_urls,
        "gitSha": sha,
        "createdAt": created,
    }
    validate_record(record)
    for alias in alias_urls:
        if not URL_RE.match(alias):
            raise ValueError("invalid alias url")

    print(json.dumps(record, separators=(",", ":")))


if __name__ == "__main__":
    main()
