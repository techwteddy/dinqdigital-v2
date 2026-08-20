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
import { Clients } from './src/collections/Clients'
import { Deals } from './src/collections/Deals'
import { Projects } from './src/collections/Projects'
import { Milestones } from './src/collections/Milestones'
import { Posts } from './src/collections/Posts'
import { Team } from './src/collections/Team'
import { Media } from './src/collections/Media'
import { Events } from './src/collections/Events'
import { Domains } from './src/collections/Domains'
import { notifyClientFromFormSubmission } from './src/lib/notify-client-from-submission'
import { adminOnlyAccess } from './src/lib/payload-access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dinq-payload-secret',
  routes: {
    admin: '/cms',
  },
  admin: {
    user: PayloadUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    PayloadUsers,
    AgencyQuotes,
    Clients,
    Deals,
    Projects,
    Milestones,
    Posts,
    Team,
    Media,
    Events,
    Domains,
  ],
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
        checkbox: false,
        country: false,
        state: false,
        number: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) =>
          defaultFields
            .filter(
              (field) =>
                !('name' in field && field.name === 'confirmationMessage')
            )
            .map((field) => {
              // Email notification "message" is also richText and needs an editor.
              if (
                'name' in field &&
                field.name === 'emails' &&
                field.type === 'array'
              ) {
                return {
                  ...field,
                  fields: field.fields?.filter(
                    (emailField) =>
                      !('name' in emailField && emailField.name === 'message')
                  ),
                }
              }
              return field
            }),
      },
      // Quote + service forms POST to Payload /api/form-submissions.
      // After save, notify the matching DinqClaw client (fail silently).
      formSubmissionOverrides: {
        access: adminOnlyAccess,
        hooks: {
          afterChange: [
            async ({ doc, operation, req }) => {
              if (operation !== 'create') return doc
              void notifyClientFromFormSubmission({
                payload: req.payload,
                doc,
              })
              return doc
            },
          ],
        },
      },
    }),
  ],
})
