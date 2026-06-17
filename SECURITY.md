# Security Policy

## Security Best Practices

This document outlines the security measures and best practices implemented in this project.

### Environment Variables

- **Never commit `.env` files** - Use `.env.example` as a template
- All sensitive data (API keys, database credentials) must be stored in environment variables
- Use strong, random values for all secrets

### Dependency Management

- Run `npm audit` regularly to check for vulnerabilities
- Keep dependencies up to date: `npm update`
- Review dependency security advisories before updating
- Use `npm ci` instead of `npm install` in production

### File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store uploads outside the web root
- Set appropriate file permissions

### API Security

- Use HTTPS only (enforce in production)
- Implement rate limiting
- Validate and sanitize all inputs
- Use CORS appropriately
- Implement authentication/authorization

### Database Security

- Use parameterized queries to prevent SQL injection
- Enforce strong password policies
- Enable database encryption
- Regular backups
- Principle of least privilege for database users

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

## Security Updates

We recommend updating to the latest versions of dependencies as soon as security patches are available.
