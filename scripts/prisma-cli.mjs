import { spawnSync } from 'node:child_process'
import './load-env.mjs'

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/prisma-cli.mjs <prisma-args...>')
  process.exit(1)
}

const result = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

process.exit(result.status ?? 1)
