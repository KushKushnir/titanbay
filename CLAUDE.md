# CLAUDE.md

## Project Overview

A RESTful backend API for managing private market funds and investor commitments.

## Stack

- **Runtime**: Node.js
- **Framework**: Hono
- **Language**: TypeScript
- **Package manager**: pnpm
- **ORM**: Drizzle
- **Database**: PostgreSQL (via Docker Compose)
- **Validation**: Valibot

## Project Structure

```
src/
  index.ts          # Entry point, Hono app setup
  routes/           # Route handlers grouped by resource
  db/
    schema.ts       # Drizzle schema definitions
    index.ts        # DB connection
  validators/       # Valibot schemas
drizzle.config.ts
docker-compose.yml
```

## Key Conventions

- RESTful routes: noun-based, e.g. `/funds`, `/funds/:id/commitments`
- HTTP verbs: GET / POST / PATCH / DELETE
- All responses are JSON
- Meaningful HTTP status codes throughout (200, 201, 400, 404, 422, 500)
- Validation on all incoming request bodies using Valibot
- Errors return a consistent shape: `{ error: string }`

## Database

PostgreSQL runs locally via Docker Compose. To start:

```bash
docker compose up -d
```

Drizzle migrations:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Running Locally

```bash
pnpm install
docker compose up -d
pnpm drizzle-kit migrate
pnpm dev
```

## Behaviour
- Never request to build/write/modify/echo/sed a file. If ever needed, this will be requested by the developer
- When working on a problem, provide suggestions with the chat in a format that can be easily copy and pasted
