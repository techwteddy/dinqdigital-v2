# Contributing to SaaS Starter Kit

First off, **thank you** for considering contributing! 🎉

This project thrives because of developers like you. Whether you're fixing a bug, adding a feature, improving documentation, or just opening an issue — every contribution matters.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Convention](#commit-message-convention)

---

## Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the maintainers.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please:
1. Check the [existing issues](https://github.com/OmarSharaf/launchkit/issues) to avoid duplicates.
2. Use the **Bug Report** issue template.
3. Include as much detail as possible: steps to reproduce, expected vs. actual behavior, screenshots, and your environment.

### 💡 Suggesting Features

We love new ideas! Use the **Feature Request** issue template and explain:
- The problem you're trying to solve
- Your proposed solution
- Why this would benefit other users

### 🔧 Submitting Code

1. Look for issues labeled `good first issue` or `help wanted`.
2. Comment on the issue to let others know you're working on it.
3. Fork the repo and create a branch from `develop`.
4. Write your code following our [coding standards](#coding-standards).
5. Add or update tests as needed.
6. Open a Pull Request to `develop`.

---

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/launchkit.git
cd launchkit

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in your values in .env.local

# 4. Set up the database
npx prisma migrate dev
npx prisma db seed

# 5. Start the dev server
npm run dev
```

---

## Pull Request Process

1. **Branch naming**: `feat/your-feature`, `fix/your-bug`, `docs/your-docs`, `chore/your-chore`
2. **Keep PRs focused**: One feature or fix per PR.
3. **Update docs**: If you change functionality, update the relevant documentation.
4. **Pass all checks**: CI must be green (lint, type-check, tests, build).
5. **Request a review**: Tag a maintainer once you're ready.

---

## Coding Standards

- **TypeScript**: Strict mode. No `any` unless absolutely necessary.
- **Components**: Functional components with hooks. No class components.
- **Naming**: `PascalCase` for components, `camelCase` for functions/variables, `kebab-case` for files.
- **Imports**: Use `@/` path aliases. Group imports: external → internal → types → styles.
- **Error handling**: Always handle errors explicitly. Never swallow errors silently.
- **Comments**: Write self-documenting code. Add JSDoc to exported functions.

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add Google OAuth provider
fix(billing): resolve webhook signature verification
docs(readme): update quickstart instructions
chore(deps): upgrade to Next.js 15.1
```

---

Thank you again for your contribution! 🚀
