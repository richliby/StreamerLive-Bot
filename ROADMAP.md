# Development Roadmap

This roadmap outlines the steps to build **StreamerLive-Bot** using Node.js, TypeScript, Supabase, and Docker.

---

## Phase 1: Project Setup & Architecture (1–2 weeks)

* **Initialize Repo & Boilerplate**

  * Scaffold a Node + TypeScript project (e.g., with a custom `tsconfig.json`).
  * Define folder structure:

    ```text
    /src
      /bots      # Twitch & Discord adapters
      /core      # Command processors, business logic
      /db        # Supabase client & schema migrations
      /api       # REST/WebSocket layer
      /utils
    tsconfig.json
    package.json
    Dockerfile
    docker-compose.yml
    ```

* **Docker Dev Environment**

  * Write a `Dockerfile` for local development: use a Node image, install dependencies, mount source.
  * Create `docker-compose.yml`:

    * `app` (Node service)
    * `supabase` (or point to hosted project)
* **Supabase Kick‑off**

  * Create a Supabase project; note `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
  * Plan initial tables: `users`, `streamers`, `chat_levels`, `raid_trains`, `train_signups`.

---

## Phase 2: Supabase Integration & Auth (1–2 weeks)

* **Data Modeling & Migrations**

  * Define tables via SQL or Supabase Studio and set RLS policies.
  * Example tables:

    * `users` (`id`, `email`, `role`, `created_at`)
    * `chat_levels` (`user_id`, `xp`, `level`)
    * `raid_trains` (`id`, `streamer_id`, `scheduled_for`)
    * `train_signups` (`raid_train_id`, `user_id`, `signed_up_at`)
* **OAuth Flow**

  * Implement Twitch & Discord OAuth using Supabase Auth or custom endpoints.
  * Securely store and refresh tokens.
* **Supabase Client Module**

  * Create `/src/db/supabase.ts` wrapper for database operations.

---

## Phase 3: Bot Framework & Command Routing (2 weeks)

* **Twitch Bot**

  * Use **tmi.js** (TypeScript) to connect, authenticate, and listen for chat commands.
* **Discord Bot**

  * Use **discord.js** (TypeScript); register slash commands (`/join`, `/level`, `/train`).
* **Command Processor**

  * Implement a dispatcher in `/src/core/commands.ts` mapping commands to handlers.
  * Handlers interact with the Supabase client to read and write state.
* **Resilience**

  * Add reconnect logic, rate‑limit guards, and structured logging.

---

## Phase 4: Core Feature Implementation (3–4 weeks)

1. **Chat‑Level System**

   * Track messages, award XP, compute levels.
   * Enforce minimum level requirement for raid‑train participation.
2. **Raid Train Sign‑up**

   * Support commands: `!train create`, `!train join`, `!train leave`, `!train list`.
   * Store sign‑ups in `train_signups` table.
3. **Scheduling & Calendar**

   * Integrate Google Calendar API for streamer schedules.
   * Expose `GET /calendar/:streamer` endpoint returning upcoming trains.
4. **Advertisement Posting**

   * On new signup, post a templated announcement tagging the user.
   * Make templates configurable via environment variables or a Supabase table.

---

## Phase 5: Dockerization & Deployment (1–2 weeks)

* **Production Dockerfile**

  * Use multi‑stage builds: compile TS then build a lightweight runtime image.
* **Production Compose**

  * Create `docker-compose.prod.yml` for `app`, `supabase` (if self‑hosted), and any cache.
* **Environment Management**

  * Document required env vars in `.env.example`.
* **Deployment Options**

  * DigitalOcean App Platform (Docker)
  * Kubernetes (optional, for advanced scaling)

---

## Phase 6: Testing, CI/CD & Documentation (2 weeks)

* **Tests**

  * Unit tests with Jest and TS; mock Supabase.
  * End‑to‑end tests for bot commands using test harnesses.
* **CI Pipeline**

  * GitHub Actions: lint, type‑check, test, build Docker.
* **API Documentation**

  * Maintain an OpenAPI spec for REST/WebSocket endpoints.
* **Contributing Guide**

  * Update README with setup, Docker commands, and feature overview.

---

## Phase 7: Front‑End Kick‑off (Future)

* Finalize API contracts (REST/WebSocket messages).
* Scaffold React or Flutter client.
* Build UI for calendar views, train sign‑up flows, and level dashboard.
