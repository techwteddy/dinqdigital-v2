import { spawnSync } from 'node:child_process'
import './load-env.mjs'

const result = spawnSync(
  'node',
  ['-r', 'ts-node/register/transpile-only', 'prisma/seed.ts'],
  {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  }
)

process.exit(result.status ?? 1)
