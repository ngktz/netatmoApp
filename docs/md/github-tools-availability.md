---
category: CTX
tags: [github, tools, mcp, pat, configuration]
created: 2025-01-27
---

# GitHub Tools Availability

## Context

GitHub MCP Tools sind in diesem Projekt konfiguriert und verfügbar. Der AI-Assistent kann GitHub-Issues lesen, Kommentare erstellen und andere GitHub-Operationen durchführen.

## Configuration

- **MCP Server**: `github-tools` ist in `.cursor/mcp.json` konfiguriert
- **Token Location**: Der GitHub PAT (Personal Access Token) wird aus `.cursor/.env.github-mcp` geladen
- **Environment Variable**: `GITHUB_PAT` wird als Bearer Token verwendet

## Available Tools

Die folgenden GitHub-Tools sind aktiviert und können verwendet werden:

- `get_issue` - GitHub Issues lesen
- `get_issue_comments` - Issue-Kommentare lesen
- `add_issue_comment` - Kommentare zu Issues hinzufügen
- `create_issue` - Neue Issues erstellen
- `update_issue` - Issues aktualisieren
- `list_issues` - Issues auflisten
- `search_issues` - Issues durchsuchen
- `create_pull_request` - Pull Requests erstellen
- `get_pull_request` - Pull Requests lesen
- `list_pull_requests` - Pull Requests auflisten
- `get_commit` - Commits lesen
- `list_commits` - Commits auflisten
- `list_branches` - Branches auflisten
- `create_branch` - Branches erstellen

## Usage in Workflows

Diese Tools werden in den Workflow-Commands verwendet:
- `wf1-create-issue.md` - Issue-Erstellung
- `wf2-plan-implementation-and-create-branch.md` - Issue-Lesen und Branch-Erstellung
- `wf3-plan-unit-test-strategy.md` - Issue-Kommentare lesen
- `wf4-create-unit-tests.md` - Test-Strategie dokumentieren
- `wf5-write-code.md` - Issue-Informationen lesen und Updates posten
- `wf6-review-code.md` - Code-Review-Informationen
- `wf7-merge-pr.md` - Pull Request-Operationen

## Important Notes

- Der GitHub PAT sollte **NIEMALS** in einer Memory gespeichert werden (Sicherheitsrisiko)
- Der Token wird nur aus der `.env.github-mcp` Datei geladen
- Die `.env.github-mcp` Datei sollte in `.gitignore` sein
- Wenn GitHub-Tools nicht funktionieren, prüfe:
  1. Ob `.cursor/.env.github-mcp` existiert
  2. Ob `GITHUB_PAT` in der Datei gesetzt ist
  3. Ob der Token noch gültig ist

## Related Files

- `.cursor/mcp.json` - MCP Server Konfiguration
- `.cursor/.env.github-mcp` - GitHub PAT (nicht versioniert)

