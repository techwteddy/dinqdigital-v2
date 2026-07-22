import dns from 'node:dns'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import sharp from 'sharp'

// Prefer IPv4 — Node 17+ can pick unreachable IPv6 for Supabase hosts.
dns.setDefaultResultOrder('ipv4first')

import { PayloadUsers } from './src/collections/PayloadUsers'
import { AgencyQuotes } from './src/collections/AgencyQuotes'
import { Posts } from './src/collections/Posts'
import { Team } from './src/collections/Team'
import { Media } from './src/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dinq-payload-secret',
  admin: {
    user: PayloadUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [PayloadUsers, AgencyQuotes, Posts, Team, Media],
  db: postgresAdapter({
    // Keep Payload tables/enums out of Prisma's public schema to avoid
    // interactive "create or rename enum?" prompts during db push.
    schemaName: 'payload',
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    formBuilderPlugin({
      fields: {
        text: true,
        email: true,
        textarea: true,
        select: true,
        message: false,
      },
    }),
  ],
})
