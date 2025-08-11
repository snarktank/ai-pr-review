# AI PR Review Workflow

A robust GitHub Actions workflow that provides AI-powered code reviews using [Amp](https://ampcode.com) or [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Get intelligent, context-aware feedback on your pull requests automatically.

## Table of Contents
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Configuration Options](#configuration-options)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- **Smart Reviews**: Advanced AI analysis with context-aware feedback
- **Robust Error Handling**: Multiple JSON extraction methods, timeouts, and fallback mechanisms
- **Secure**: Proper secret masking, minimal permissions, and configurable security options  
- **Flexible**: Configurable review behavior (comment, approve, request changes)
- **Reliable**: Handles non-deterministic AI responses with multiple parsing strategies

## Prerequisites

Before setting up the workflow, you need:

1. **A GitHub repository** with Actions enabled (free for public repositories)
2. **An AI API key** from one of these providers:
   - **Amp** (recommended): Get your API key at [ampcode.com](https://ampcode.com)
   - **Claude Code**: Get your API key at [console.anthropic.com](https://console.anthropic.com)
3. **GitHub CLI** (optional but recommended): Install from [cli.github.com](https://cli.github.com)

## Quick Start

### 1. Add the Workflow

Copy [`.github/workflows/ai-pr-review.yml`](.github/workflows/ai-pr-review.yml) to your repository's `.github/workflows/` directory.

**Important:** You must commit this workflow file to your main branch first before it will be able to run on pull requests.

### 2. Get Your API Key

#### For Amp (Recommended)
1. Visit [ampcode.com](https://ampcode.com) and create a free account (includes $10 free credit)
2. Sign up or log in to your account
3. Navigate to [ampcode.com/settings](https://ampcode.com/settings)
4. Generate a new API key
5. Copy the API key (it will look like `sgamp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

#### For Claude Code
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (it will look like `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Add Your API Key as a Repository Secret

GitHub repository secrets are different from environment variables on your local machine. Secrets are encrypted values stored securely by GitHub and made available to your workflows during execution. They are never exposed in logs or to unauthorized users.

**Why use secrets instead of environment variables?**
- Environment variables are stored locally on your machine and not accessible to GitHub Actions
- Repository secrets are encrypted and securely managed by GitHub
- Secrets are automatically masked in workflow logs to prevent accidental exposure
- Only authorized workflows can access the secrets

#### Option A: Using GitHub CLI (Recommended)

First, make sure you're authenticated with GitHub CLI:
```bash
gh auth login
```

Then set your API key as a secret:

**For Amp:**
```bash
gh secret set AMP_API_KEY -b "your-amp-api-key-here"
```

**For Claude Code:**
```bash
gh secret set ANTHROPIC_API_KEY -b "your-anthropic-api-key-here"
```

#### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. For **Name**, enter:
   - `AMP_API_KEY` (if using Amp)
   - `ANTHROPIC_API_KEY` (if using Claude Code)
6. For **Value**, paste your API key
7. Click **Add secret**

### 4. Test the Setup

Create a test pull request to verify the workflow runs correctly:

1. Create a new branch: `git checkout -b test-ai-review`
2. Make a small change to any file
3. Commit and push: `git add . && git commit -m "test: trigger AI review" && git push -u origin test-ai-review`
4. Create a pull request: `gh pr create --title "Test AI Review" --body "Testing the AI review workflow"`
5. Check the Actions tab to see the workflow running
6. The AI review should appear as comments on your pull request

## Step-by-Step Setup

### Step 1: Copy the Workflow File

Create the directory structure if it doesn't exist:
```bash
mkdir -p .github/workflows
```

Copy the workflow file:
```bash
curl -o .github/workflows/ai-pr-review.yml https://raw.githubusercontent.com/snarktank/ai-pr-review/main/.github/workflows/ai-pr-review.yml
```

### Step 2: Commit the Workflow to Main Branch

```bash
git add .github/workflows/ai-pr-review.yml
git commit -m "feat: add AI PR review workflow"
git push origin main
```

### Step 3: Verify Repository Permissions

Ensure your repository has the correct permissions:
1. Go to your repository settings
2. Click **Actions** in the left sidebar
3. Under **General**, ensure:
   - "Allow all actions and reusable workflows" is selected
   - "Read and write permissions" is enabled for GITHUB_TOKEN

### Step 4: Set Up API Key Secret

Follow the instructions in [step 3](#3-add-your-api-key-as-a-repository-secret) above.

### Step 5: Test with a Pull Request

The workflow triggers on these events:
- `opened`: When a new PR is created
- `synchronize`: When new commits are pushed to an existing PR
- `reopened`: When a closed PR is reopened
- `ready_for_review`: When a draft PR is marked ready for review

## Configuration Options

### Review Behavior

Control how the AI review is posted by setting the `REVIEW_EVENT` environment variable in the workflow:

- **`COMMENT`** (default): Posts review as comments only
- **`APPROVE`**: Automatically approves PRs that pass review
- **`REQUEST_CHANGES`**: Requests changes when issues are found

Example:
```yaml
env:
  REVIEW_EVENT: APPROVE
```

### Custom System Prompt

Customize the AI instructions by modifying `SYSTEM_PROMPT`:

```yaml
env:
  SYSTEM_PROMPT: |
    Review this patch like a thoughtful senior engineer.
    Focus on security vulnerabilities, performance issues, and code quality.
    Be concise and constructive. Highlight both problems and good practices.
    Provide specific suggestions for improvement.
```

### Using Claude Code Instead of Amp

To use Claude Code instead of Amp:

1. Set the `ANTHROPIC_API_KEY` secret instead of `AMP_API_KEY`
2. Update the workflow environment variables:

```yaml
env:
  REVIEW_CLI_BIN: claude
  REVIEW_CLI_ARGS: -p --output-format json --max-turns 3
```

## Advanced Usage

### Custom CLI Arguments

Add custom arguments to the AI CLI:

```yaml
env:
  REVIEW_CLI_ARGS: -x --timeout 300 --model gpt-4
```

### Debug Mode

Enable verbose logging:

```yaml
env:
  DEBUG: true
```

### Timeout Configuration

The workflow has built-in timeouts:
- AI review calls: 300 seconds (5 minutes)
- JSON extraction: 120 seconds (2 minutes)

These are designed to handle large pull requests while preventing runaway processes.

## Requirements

- **GitHub Actions**: Enabled on your repository (free for public repos, included in GitHub plans for private repos)
- **AI API Key**: Either Amp or Claude Code
- **Node.js 20**: Automatically installed by the workflow
- **Repository Permissions**: Actions must have read/write access

## Security Features

- **Secret Masking**: API keys are automatically masked in workflow logs
- **Minimal Permissions**: Only requires `contents: read`, `pull-requests: write`, `statuses: write`
- **Timeout Protection**: Prevents runaway AI calls
- **Fallback Responses**: Graceful degradation when AI calls fail
- **No Secret Exposure**: API keys are never logged or exposed in outputs

## How It Works

1. **Trigger**: Workflow runs when PR events occur (open, sync, reopen, ready_for_review)
2. **Setup**: Installs required tools (Amp CLI or Claude Code) and Node.js
3. **Context**: Gathers PR information including title, description, and diff
4. **Review**: Sends the code changes to AI with custom instructions
5. **Parse**: Extracts structured feedback using multiple parsing methods
6. **Post**: Creates GitHub review with summary and inline comments
7. **Status**: Sets commit status to indicate review completion

## Example Output

The AI reviewer provides:

- **Summary**: High-level assessment of the changes
- **Inline Comments**: Specific feedback on individual lines of code
- **Commit Status**: Success/failure indication

Example review summary:
```markdown
## AI Code Review

**Overall Assessment: Good implementation with some concerns**

### Strengths
- Comprehensive input validation
- Proper error handling patterns
- Clear and descriptive variable names
- Good separation of concerns

### Areas for Improvement
- Missing unit tests for new functionality
- Potential performance bottleneck in data processing loop
- Consider using TypeScript for better type safety
- Add JSDoc comments for public methods

### Security Notes
- Ensure API keys are properly validated
- Add rate limiting to prevent abuse
```

## Troubleshooting

### Common Issues

**"No API key found"**
- Verify you've set the correct secret name (`AMP_API_KEY` or `ANTHROPIC_API_KEY`)
- Check that the secret value is correct and complete
- Ensure the secret is set at the repository level, not organization level

**"Workflow not running"**
- Confirm the workflow file is committed to your main/default branch
- Check that GitHub Actions is enabled for your repository
- Verify the workflow syntax is correct (no YAML errors)

**"Invalid JSON generated"**
- This usually resolves on retry due to AI response variability
- Check the workflow logs for the actual AI output
- The workflow has multiple fallback parsing methods

**"AI review timed out"**
- Large PRs may exceed timeout limits
- Consider breaking large changes into smaller PRs
- Check if your API key has rate limiting issues

**"Permission denied"**
- Ensure the GITHUB_TOKEN has write permissions for pull requests
- Check repository settings under Actions > General > Workflow permissions

### Getting Help

1. **Check workflow logs**: Go to Actions tab in your repository to see detailed execution logs
2. **Review API quotas**: Ensure your API key has sufficient quota/credits
3. **Test manually**: Try running the CLI tool locally with your API key
4. **Open an issue**: Report bugs or request features in this repository

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

### Development

Test changes by:
1. Setting up the workflow in a test repository
2. Creating test pull requests with various code changes
3. Observing AI review behavior and accuracy
4. Iterating based on results

### Workflow Testing

To test workflow changes:
1. Fork this repository
2. Make your changes to the workflow file
3. Set up API keys in your fork
4. Create test PRs to trigger the workflow
5. Verify the changes work as expected

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Amp](https://ampcode.com) for providing AI-powered code review capabilities
- [Anthropic](https://anthropic.com) for Claude Code AI assistant
- GitHub Actions for the automation platform
- The open source community for inspiration and feedback

---

**Need help?** Open an issue or check the [Amp documentation](https://ampcode.com/manual) for more details.
