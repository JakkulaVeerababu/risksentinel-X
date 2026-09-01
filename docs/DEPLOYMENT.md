# RiskSentinel X - Cloud Deployment Guide

This guide outlines the steps to deploy RiskSentinel X using managed cloud providers: **Vercel** for the Next.js frontend, and **Render** for the Python backend.

## Step 1: Deploy Backend to Render

Render will host the FastAPI backend via Docker. We have included a `render.yaml` Blueprint to make this process seamless.

1. Create a free account on [Render](https://render.com).
2. Go to the **Dashboard** and click **New > Blueprint**.
3. Connect your GitHub repository containing the RiskSentinel X code.
4. Render will detect the `render.yaml` file. During setup, it will prompt you for the following environment variables:
   - `GEMINI_API_KEY`: Get this from Google AI Studio. This powers the Investigation Agent.
   - `DATABASE_URL`: Provide your production PostgreSQL connection string (Render also offers managed Postgres).
   - `STRIPE_API_KEY`: Your Stripe secret key if processing live webhook events.
5. Click **Apply**.
6. Wait for the deployment to finish. Once live, note your backend URL (e.g., `https://risksentinel-backend-xyz.onrender.com`).

## Step 2: Deploy Frontend to Vercel

Vercel provides native, optimized hosting for Next.js applications.

1. Create a free account on [Vercel](https://vercel.com).
2. Go to the **Dashboard** and click **Add New > Project**.
3. Import your GitHub repository.
4. **Important**: In the configuration step, change the **Root Directory** to `frontend`.
5. Open the **Environment Variables** section and add the following:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your Render backend + `/api/v1` (e.g., `https://risksentinel-backend-xyz.onrender.com/api/v1`).
   - `NEXT_PUBLIC_REALTIME_URL`: The same backend URL, but replace `https` with `wss` and point to the stream endpoint (e.g., `wss://risksentinel-backend-xyz.onrender.com/api/v1/stream/events`).
6. Click **Deploy**.

## Testing the Deployment

1. Visit your live Vercel URL.
2. Go to **Settings > Access & Security** and add team members.
3. Check the **Developer APIs** tab to ensure the frontend is successfully fetching dynamic backend data.
4. Trigger a simulated transaction in the backend to ensure the Gemini AI successfully analyzes it and updates the Real-time Dashboard via WebSockets.

## Troubleshooting

- **CORS Errors**: If the frontend cannot communicate with the backend, ensure your backend's `main.py` CORS middleware is updated to allow your `.vercel.app` domain.
- **WebSocket Drops**: Render free tiers may sleep after 15 minutes of inactivity, causing the realtime analytics dashboard to disconnect until the server wakes up. Consider upgrading to a paid Render tier for production.
