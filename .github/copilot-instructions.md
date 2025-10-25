# StreamerLive-Bot Copilot Instructions

## Project Overview
StreamerLive-Bot is a Node.js application integrating Twitch, Discord, and Supabase to manage streamer raid trains, user levels, and scheduling. It uses Discord slash commands, a level system, and Supabase for persistent data.

## Architecture & Key Components
- **Discord Integration**: Slash commands are defined in `src/deploy-commands.ts` and registered via the Discord REST API (`src/api/index.ts`).
- **Level System**: User XP and levels are managed in `src/levelSystem.ts`, with user data modeled in `src/appdata/user.ts` and persisted in Supabase (`src/db/index.ts`).
- **Database**: Supabase is the primary database. Table and type definitions are in `src/db/tables.ts` and `src/db/types.ts`.
- **Config**: Environment variables are loaded via `dotenv/config`. Required keys: `SUPABASE_API_URL`, `SUPABASE_PUB_KEY`, `DISCORD_API_TOKEN`, `DISCORD_CLIENT_ID`.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Initialize Supabase**: `npx supabase init`
- **Run in development**: `npm run dev` (uses Nodemon for hot reload)
- **Run tests**: `npm run test` (Jest framework, tests in `src/db/levelSystem.test.ts`)

## Patterns & Conventions
- **TypeScript**: Most source files use TypeScript for type safety.
- **User Model**: Use the `User` class (`src/appdata/user.ts`) for user data. Convert DB rows with `User.fromDb()`.
- **Level Calculation**: XP thresholds and decay logic are in `src/levelSystem.ts`. Update XP via `addXP()`.
- **Discord Commands**: Define new commands using `SlashCommandBuilder` and register them in `src/deploy-commands.ts`.
- **Environment Variables**: Always check for required env vars before initializing clients.

## Integration Points
- **Discord**: REST API via `discord.js`.
- **Supabase**: Database client via `@supabase/supabase-js`.
- **External APIs**: Twitch, Discord, Google Calendar (planned).

## Examples
- Registering a Discord command: see `src/deploy-commands.ts`.
- Adding XP to a user: use `addXP(guildId, user, amount)` in `src/levelSystem.ts`.
- Accessing Supabase: use `db` from `src/db/index.ts`.

## Additional Notes
- All persistent data should be stored in Supabase.
- Follow the structure and naming conventions in `src/appdata/user.ts` and `src/db/types.ts` for user-related logic.
- For new features, reference existing patterns in the relevant files above.

---
If any section is unclear or missing, please provide feedback to improve these instructions.