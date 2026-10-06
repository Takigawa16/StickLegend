# Stickbound Legends (Vercel + Supabase)
Static game in `public/`, serverless API in `api/`, accounts + saves + arena leaderboard stored in Supabase (Postgres).

## Deploy
1. Create a project at supabase.com. Open the SQL Editor and run the contents of `schema.sql` once.
2. In Supabase, go to Project Settings > API and copy the Project URL and the `service_role` secret key (not the anon key — the server needs the service role to bypass RLS).
3. Push this folder to GitHub and import it in Vercel (no build settings needed), or run `npx vercel --prod` from this folder.
4. In Vercel, Project > Settings > Environment Variables, add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = the service_role key (mark it Sensitive)
   - `AUTH_SECRET` = any long random string (used to sign login sessions)
5. Redeploy. Local test: `npm i && npx vercel dev` (run `npx vercel env pull .env.local` first to get the env vars locally).

Note: the `service_role` key must never be exposed to the browser — it only ever lives in the `api/` serverless functions, never in `public/`.
