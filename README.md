# AI PR Review Workflow

A robust GitHub Actions workflow that provides AI-powered code reviews using [Amp](https://ampcode.com). Get intelligent, context-aware feedback on your pull requests automatically.

## ✨ Features

- **Smart Reviews**: Uses Amp's advanced AI capabilities including oracle consultation for deep analysis
- **Robust Error Handling**: Multiple JSON extraction methods, timeouts, and fallback mechanisms
- **Secure**: Proper secret masking, minimal permissions, and configurable security options  
- **Flexible**: Configurable review behavior (comment, approve, request changes)
- **Reliable**: Handles non-deterministic AI responses with multiple parsing strategies

## 🚀 Quick Start

### 1. Add the Workflow

Copy [`.github/workflows/ai-pr-review.yml`](.github/workflows/ai-pr-review.yml) to your repository's `.github/workflows/` directory.

### 2. Set up Secrets

Add your AI API key to your repository secrets:

**For Amp (default):**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AMP_API_KEY`
4. Value: Your Amp API key from [ampcode.com](https://ampcode.com)

**For Claude Code:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### 3. Configure (Optional)

Edit the workflow environment variables to customize behavior:

```yaml
env:
  REVIEW_EVENT: COMMENT          # COMMENT, APPROVE, or REQUEST_CHANGES
  REVIEW_CLI_BIN: amp            # CLI tool to use
  REVIEW_CLI_ARGS: -x            # CLI arguments
  SYSTEM_PROMPT: |               # Customize the AI instructions
    Review this patch like a thoughtful senior engineer.
    Prioritize correctness, security, performance, readability, and tests.
    Be concise and constructive. Praise good changes. Group related issues.
    Consult the oracle. Make sure that the changes match the conventions in AGENT.md
```

## 🔧 Configuration Options

### Review Behavior

- **`COMMENT`** (default): Posts review as comments
- **`APPROVE`**: Approves PRs that pass review
- **`REQUEST_CHANGES`**: Requests changes when issues are found

### System Prompt

Customize the AI instructions by modifying `SYSTEM_PROMPT`. The prompt should:
- Define the reviewer role and expertise level
- Specify what to focus on (security, performance, etc.)
- Set the tone (constructive, concise, etc.)
- Include "Consult the oracle" for advanced Amp analysis

### Advanced Configuration

```yaml
env:
  REVIEW_CLI_BIN: amp                    # Alternative: claude, cursor-ai, other compatible CLIs
  REVIEW_CLI_ARGS: -x --timeout 300     # Additional CLI arguments
```

#### Using Claude Code

To use [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instead of Amp:

```yaml
env:
  REVIEW_CLI_BIN: claude
  REVIEW_CLI_ARGS: -p --output-format json --max-turns 3
```

And set the `ANTHROPIC_API_KEY` secret in your repository settings instead of `AMP_API_KEY`.

## 📋 Requirements

- **AI API Key**: 
  - For Amp: Get one from [ampcode.com](https://ampcode.com) and set as `AMP_API_KEY`
  - For Claude Code: Get one from [console.anthropic.com](https://console.anthropic.com) and set as `ANTHROPIC_API_KEY`
- **GitHub Actions**: Enabled on your repository
- **Node.js 20**: Used by the workflow (automatically installed)

## 🔒 Security Features

- **Secret Masking**: API keys are automatically masked in logs
- **Minimal Permissions**: Only requires `contents: read`, `pull-requests: write`, `statuses: write`
- **Timeout Protection**: Prevents runaway AI calls
- **Fallback Responses**: Graceful degradation when AI calls fail

## 🛠️ How It Works

1. **Trigger**: Runs on PR open, sync, reopen, or ready_for_review
2. **Setup**: Installs Amp CLI and gathers PR context
3. **Review**: Sends diff to AI with custom instructions
4. **Parse**: Extracts JSON response using multiple methods
5. **Post**: Creates GitHub review with summary and inline comments
6. **Status**: Sets commit status based on review results

## 📊 Example Output

The AI reviewer provides:

- **Summary**: High-level assessment with strengths and concerns
- **Inline Comments**: Specific feedback on code changes
- **Commit Status**: Success/failure indication

Example review summary:
```markdown
## AI Code Review

**Solid implementation with good error handling**, but consider these improvements:

### ✅ Strengths
- Comprehensive input validation
- Proper error handling patterns
- Clear naming conventions

### ⚠️ Concerns  
- Missing unit tests for edge cases
- Potential memory leak in event listeners
- Consider using TypeScript for better type safety
```

## 🔍 Troubleshooting

### Common Issues

**"Invalid JSON generated"**
- The workflow has robust JSON parsing, but this indicates an AI response format issue
- Check logs for actual AI output in the "CLI Output" section
- Usually resolves on retry

**"AI review timed out"**
- Large diffs may exceed timeout limits
- Consider breaking large PRs into smaller ones
- Adjust timeout in workflow if needed

**"No review posted"**
- Check that `AMP_API_KEY` secret is set correctly
- Verify repository has pull request write permissions
- Check action logs for specific error messages

### Debug Mode

Enable verbose logging by adding to your workflow:

```yaml
env:
  DEBUG: true
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

### Development

Test changes by:
1. Modifying the workflow in a test repository
2. Creating a test PR
3. Observing the AI review output
4. Iterating based on results

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Amp](https://ampcode.com) for providing the AI review capabilities
- GitHub Actions for the automation platform
- The open source community for inspiration and feedback

---

**Need help?** Open an issue or check the [Amp documentation](https://ampcode.com/manual) for more details.
