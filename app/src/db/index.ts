import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'
import * as relations from './relations.js'

const client = postgres(process.env.DATABASE_URL!)
export const titanDb = drizzle(client, { schema: { ...schema, ...relations } })
