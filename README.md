# Stickbound Legends (Vercel)
Static game in `public/`, serverless API in `api/`, accounts + saves stored in Upstash Redis.

## Deploy
1. Push this folder to GitHub, import it in Vercel (no build settings needed).
2. Project > Storage > add **Upstash Redis** (Marketplace). It sets the Redis env vars automatically.
3. Project > Settings > Environment Variables: add `AUTH_SECRET` = any long random string.
4. Redeploy. Local test: `npm i && npx vercel dev`.

Note: saves are trusted from the client (fine for a prototype; validate server-side before adding rewards/leaderboards).
