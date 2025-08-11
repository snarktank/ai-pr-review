# Contributing to AI PR Review Workflow

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- GitHub account
- Access to a repository where you can test GitHub Actions
- Amp API key for testing (get one from [ampcode.com](https://ampcode.com))

### Development Setup

1. **Fork the repository**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/ai-pr-review-workflow.git
   cd ai-pr-review-workflow
   ```

2. **Create a test repository**
   - Create a new repository or use an existing one
   - Add the workflow file to `.github/workflows/`
   - Set up the `AMP_API_KEY` secret

3. **Test your changes**
   - Make changes to the workflow
   - Create a test PR in your test repository
   - Observe the AI review behavior
   - Iterate based on results

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Update the workflow YAML file
   - Update documentation if needed
   - Test thoroughly in a test repository

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Testing

Since this is a GitHub Actions workflow, testing requires:

1. **Live Testing**: Deploy to a test repository and create test PRs
2. **Edge Cases**: Test with different PR sizes, file types, and scenarios
3. **Error Conditions**: Test timeout scenarios, API failures, malformed responses

### Common Test Scenarios

- **Small PRs**: 1-5 files changed
- **Large PRs**: 20+ files changed
- **Different file types**: JavaScript, Python, Go, etc.
- **Edge cases**: Empty PRs, binary files, very long lines
- **Error conditions**: Invalid API keys, network timeouts

## 📝 Contribution Types

### Bug Fixes

- Fix workflow errors or unexpected behavior
- Improve error handling and edge cases
- Update dependencies or security issues

### Features

- Add new configuration options
- Improve AI prompt engineering
- Add support for new CLI tools
- Enhance JSON parsing capabilities

### Documentation

- Improve README clarity
- Add troubleshooting guides
- Create usage examples
- Update configuration documentation

### Performance

- Optimize workflow execution time
- Reduce API calls or token usage
- Improve caching mechanisms

## 🎯 Contribution Guidelines

### Code Quality

- **Clarity**: Workflow steps should be clearly documented
- **Error Handling**: All external calls should have proper error handling
- **Security**: Never expose secrets in logs or outputs
- **Efficiency**: Minimize workflow execution time and resource usage

### Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test improvements
- `chore:` for maintenance tasks

Examples:
```
feat: add support for custom timeout configuration
fix: handle malformed JSON responses gracefully
docs: update troubleshooting guide with common issues
```

### Pull Request Process

1. **Description**: Clearly describe what your PR does and why
2. **Testing**: Include details about how you tested the changes
3. **Breaking Changes**: Call out any breaking changes
4. **Documentation**: Update docs for new features or configuration options

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested with small PRs (1-5 files)
- [ ] Tested with large PRs (20+ files)
- [ ] Tested error conditions
- [ ] Tested in different repositories

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated if needed
- [ ] No secrets exposed in logs
- [ ] Error handling is comprehensive
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Workflow version** being used
2. **GitHub Actions logs** (with secrets redacted)
3. **Repository context** (size of PR, file types, etc.)
4. **Expected vs actual behavior**
5. **Steps to reproduce**

## 💡 Feature Requests

For feature requests, please include:

1. **Use case**: Why is this feature needed?
2. **Proposed solution**: How should it work?
3. **Alternatives**: What alternatives have you considered?
4. **Impact**: How would this affect existing users?

## 🔒 Security

- **Never commit API keys** or secrets
- **Use secret masking** for any new secret-like values
- **Follow least privilege** principle for permissions
- **Report security issues** privately via GitHub security advisories

## 📞 Getting Help

- **GitHub Discussions**: For questions and general help
- **GitHub Issues**: For bug reports and feature requests
- **Amp Documentation**: Check [ampcode.com/manual](https://ampcode.com/manual) for Amp-specific questions

## 🙏 Recognition

Contributors will be:
- Listed in the README acknowledgments
- Mentioned in release notes for significant contributions
- Invited to help maintain the project (for ongoing contributors)

Thank you for contributing to make AI-powered code reviews better for everyone! 🚀
