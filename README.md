# Morocco Tours

Supabase-backed web and mobile project migrated from the generated `anything` export.

## Supabase setup

1. Create a new Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. Copy the project URL, anon key, and service role key.
4. Create local env files from:
   - `apps/web/.env.example`
   - `apps/mobile/.env.example`

The web API routes require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
The Expo app requires `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Web

```bash
cd apps/web
npm install
npm run dev
```

For Vercel, use `apps/web` as the project root and add the Supabase environment variables before deploying.

## Mobile

```bash
cd apps/mobile
npm install
npx expo start
```
