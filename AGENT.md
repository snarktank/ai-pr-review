# AGENT.md - AI PR Review Workflow

## Commands
- **Test**: `npm test` (see CONTRIBUTING.md for testing instructions)
- **Testing**: Deploy workflow to test repository and create test PRs
- **Validation**: No build/lint commands - this is a GitHub Actions workflow project

## Architecture
- **Main Component**: `.github/workflows/ai-pr-review.yml` - GitHub Actions workflow
- **Purpose**: AI-powered PR reviews using Amp API
- **Runtime**: Node.js 20, Ubuntu latest, GitHub Actions environment
- **Dependencies**: Amp CLI (`@sourcegraph/amp`) or Claude Code (`@anthropic-ai/claude-code`), jq, curl, gh CLI
- **External APIs**: Amp API (via AMP_API_KEY secret), GitHub API

## Code Style & Conventions
- **Workflow Format**: YAML with explicit structure and error handling
- **Shell Scripting**: Use `set -euo pipefail` for robust error handling
- **Secrets**: Always mask API keys with `::add-mask::` in GitHub Actions
- **Permissions**: Minimal required: `contents: read`, `pull-requests: write`, `statuses: write`
- **Error Handling**: Multiple fallback strategies for AI response parsing
- **Timeouts**: 300s for AI calls, 120s for JSON extraction
- **Output Format**: JSON with `summaryMarkdown`, `comments`, `status` structure
- **Environment Variables**: Configurable via env vars (REVIEW_EVENT, REVIEW_CLI_BIN, etc.)
- **Commit Messages**: Use conventional commit format (feat:, fix:, docs:, etc.)
- **Security**: Never expose secrets in logs, use least privilege principle
