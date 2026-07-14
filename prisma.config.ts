import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Load Next.js env files before Prisma reads datasource.url.
// override: true so .env.local wins if a key was already injected.
config({ path: '.env' })
config({ path: '.env.local', override: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Prisma 7: migrations use datasource.url (prefer DIRECT_URL for Supabase).
  datasource: {
    url: env('DIRECT_URL'),
  },
})
