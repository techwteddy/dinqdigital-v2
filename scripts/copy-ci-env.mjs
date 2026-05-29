import { copyFileSync } from 'node:fs'

copyFileSync('.github/ci.env', '.env.local')
console.log('Copied .github/ci.env → .env.local')
