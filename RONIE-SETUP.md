# RONIE AI chat support

RONIE is the RDDS Enterprises website support chatbot. The browser sends chat messages to the Vercel serverless endpoint at `/api/chat`. The Gemini API key is read only on the server from `GEMINI_API_KEY`; it is never exposed in browser code.

## Activate RONIE on Vercel

1. Open Google AI Studio and create a Gemini API key: https://aistudio.google.com/app/apikey
2. In Vercel, open the RDDS project → Settings → Environment Variables.
3. Add `GEMINI_API_KEY` with the key from AI Studio. Do not paste the key into GitHub or website source files.
4. Optionally add `GEMINI_MODEL` with `gemini-2.5-flash`.
5. Apply to Production (and Preview if needed), save, then redeploy the latest deployment.

## Local development

Create a local `.env.local` file (never commit it) and set `GEMINI_API_KEY`. Run the Vercel dev command to test the `/api/chat` serverless function locally; plain Vite dev does not execute Vercel functions.

## Knowledge maintained in RONIE

The business context is in `api/chat.js`. Update it when services, contact information, portfolio or policies change. RONIE does not have access to private customer records and must not claim to submit enquiries or contact staff.
