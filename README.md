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

  ```bash
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

  Project structure

  app/
    src/
      index.ts          # Entry point
      routes/           # Route handlers grouped by resource
      db/
        schema.ts       # Drizzle schema definitions
        index.ts        # DB connection
      validators/       # Valibot schemas
    drizzle.config.ts
  db/
    docker-compose.yml
