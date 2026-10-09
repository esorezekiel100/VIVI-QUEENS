<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7af3db62-0e61-4a59-9a91-a375ac36c822

## Configure and Run

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set `JWT_SECRET` and `ADMIN_PASSWORD` to private values. Add your Gemini API key if you use Gemini features.
3. Run the app:
   `npm run dev`

The local database is stored in `data/database.json` and is excluded from Git. On a fresh setup, if `ADMIN_PASSWORD` is blank, the server generates a random password and prints it once when creating the database.
