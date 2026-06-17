# Contributing to AI Resume Analyzer

## Security First

Security is a shared responsibility. Please follow these guidelines:

### Before Contributing

1. **Run Security Audit**
   ```bash
   npm run security-audit
   ```

2. **Never Commit Secrets**
   - Never hardcode API keys, passwords, or tokens
   - Use environment variables
   - Test that `.env` is in `.gitignore`

3. **Update Dependencies**
   ```bash
   npm audit fix
   npm update
   ```

### Code Review Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and security checks
4. Submit a pull request
5. Address review feedback
6. Maintainers will merge after approval

### Security Guidelines

- Validate all user inputs
- Use parameterized queries
- Follow OWASP guidelines
- Never log sensitive data
- Use HTTPS everywhere
- Implement rate limiting

### Reporting Security Issues

For security vulnerabilities:
1. **DO NOT** create a public GitHub issue
2. Email: security@example.com
3. Include: severity, description, reproduction steps

## Development Setup

```bash
git clone https://github.com/MalNko/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
cp .env.example .env
npm run dev
```

## Code Standards

- Use meaningful commit messages
- Follow existing code style
- Add tests for new features
- Update documentation
- Run linter: `npm run lint`

Thank you for contributing safely!
