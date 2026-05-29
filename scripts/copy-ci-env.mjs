import { copyFileSync } from 'node:fs'

// .env — Prisma CLI (validate, migrate, generate)
// .env.local — Next.js build
copyFileSync('.github/ci.env', '.env')
copyFileSync('.github/ci.env', '.env.local')
console.log('Copied .github/ci.env → .env and .env.local')
