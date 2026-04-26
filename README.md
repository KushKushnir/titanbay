# Titanbay

A RESTful backend API for managing private market funds and investor commitments.

## Stack

- **Runtime**: Node.js
- **Framework**: Hono
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Docker Compose)
- **Validation**: Valibot

## Getting started

**Prerequisites**: Node.js, pnpm, Docker

# 1. Start the database
docker compose -f db/docker-compose.yml up -d

# 2. Copy env file and fill in your values
cp app/.env.example app/.env

# 3. Install dependencies
cd app && pnpm install

# 4. Run migrations
pnpm drizzle-kit migrate

# 5. Start the dev server
pnpm dev

Server runs on http://localhost:3000.

Testing

# Unit tests (no DB required)
pnpm test

# Integration test (requires DB running)
pnpm test:integration

API

┌────────┬────────────────────────┬─────────────────────────────┐
│ Method │          Path          │         Description         │
├────────┼────────────────────────┼─────────────────────────────┤
│ GET    │ /funds                 │ List all funds              │
├────────┼────────────────────────┼─────────────────────────────┤
│ POST   │ /funds                 │ Create a fund               │
├────────┼────────────────────────┼─────────────────────────────┤
│ PUT    │ /funds                 │ Update a fund               │
├────────┼────────────────────────┼─────────────────────────────┤
│ GET    │ /funds/:id             │ Get a fund                  │
├────────┼────────────────────────┼─────────────────────────────┤
│ GET    │ /funds/:id/investments │ List investments for a fund │
├────────┼────────────────────────┼─────────────────────────────┤
│ POST   │ /funds/:id/investments │ Add an investment to a fund │
├────────┼────────────────────────┼─────────────────────────────┤
│ GET    │ /investors             │ List all investors          │
├────────┼────────────────────────┼─────────────────────────────┤
│ POST   │ /investors             │ Create an investor          │
└────────┴────────────────────────┴─────────────────────────────┘

## Design decisions
## Stack

- PUT /funds takes id in the request body. This matches the provided API spec rather than the more conventional PUT /funds/:id
- Cascade deletes, deleting a fund or investor automatically removes their associated investments at the DB level
- Numeric amounts as strings internally — Drizzle returns NUMERIC columns as strings to avoid floating point precision loss; they are parsed to numbers in API responses

  Project structure

  app/
    src/
      index.ts               # Entry point, route mounting, error handler
      routes/
        funds/
          index.ts           # GET, POST, PUT /funds
          investments.ts     # GET, POST /funds/:id/investments
        investors/
          index.ts           # GET, POST /investors
      db/
        schema.ts            # Drizzle table and enum definitions
        relations.ts         # Drizzle relation definitions
        index.ts             # DB connection
      validators/            # Valibot request body schemas
    drizzle.config.ts
  db/
    docker-compose.yml

## AI Usage
- Used Claude Code as a pair programmer throughout, not a code generator.
I directed the pace, reviewed every suggestion before applying it, caught mistakes, and made architectural decisions myself.
- Also used the AI to flag issues
- Also used as a test and documentation generator.

