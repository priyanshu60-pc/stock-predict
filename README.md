# 📈 Signalist — Real-Time Stock Market App

A simplified, production-ready stock market tracker built with Next.js 15, Clerk, Supabase, TradingView, and Gemini AI.

## ⚡ Quick Start

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create your `.env.local`
Copy `.env.example` to `.env.local` and fill in your API keys:
```bash
copy .env.example .env.local
```

### Step 3 — Set up the database
1. Go to [supabase.com](https://supabase.com) → create a project
2. Open **SQL Editor** → paste the contents of `supabase-schema.sql` → **Run**

### Step 4 — Get your API keys

| Service | Where to get it | Cost |
|---|---|---|
| **Clerk** | [clerk.com](https://clerk.com) → Create application | Free |
| **Supabase** | Project Settings → API | Free |
| **Finnhub** | [finnhub.io/register](https://finnhub.io/register) | Free |
| **Gemini** | [ai.google.dev](https://ai.google.dev) | Free tier |
| **Resend** | [resend.com](https://resend.com) | Free (3k/mo) |

### Step 5 — Set up Clerk Webhook (for welcome emails)
1. Go to Clerk Dashboard → **Webhooks** → **Add Endpoint**
2. URL: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to: `user.created`
4. Copy the **Signing Secret** → add to `.env.local` as `CLERK_WEBHOOK_SECRET`

### Step 6 — Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fullstack React |
| Auth | Clerk | Drop-in auth, no DB config needed |
| Database | Supabase (PostgreSQL) | Simple, hosted, free tier |
| Charts | TradingView Widgets | Free, live data, zero custom WebSocket code |
| Email | Resend | 3 lines to send email |
| AI | Google Gemini 2.0 Flash | Personalized insights & emails |
| Styling | Tailwind CSS + Shadcn UI | Dark financial theme |
| Cron | Vercel Cron Jobs | Built-in, 1-line config |
| Stock Data | Finnhub API | Free real-time quotes & search |

---

## 📁 Project Structure

```
app/
  (auth)/          ← Sign in/up pages (Clerk components)
  (root)/          ← Protected pages with header
    page.tsx       ← Dashboard (4 TradingView widgets)
    search/        ← Stock search + advanced chart
    watchlist/     ← Saved stocks + price alerts
  api/
    search/        ← Finnhub proxy
    webhooks/clerk ← Welcome email trigger
    cron/daily/    ← Alert checks + daily digest
components/
  header.tsx       ← Nav + Clerk UserButton
  trading-view-widget.tsx ← Reusable chart embed
  watchlist-card.tsx
  forms/
lib/
  supabase.ts      ← DB client (3 lines)
  gemini.ts        ← AI helpers
  resend.ts        ← Email helpers
  finnhub.ts       ← Stock data helpers
  constants.ts     ← Widget configs
  actions/         ← Server actions
middleware.ts      ← Clerk route protection
vercel.json        ← Cron schedule
supabase-schema.sql ← DB setup (run once)
```

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/stocks-app
git push -u origin main

# 2. Go to vercel.com → Import project → Add env variables → Deploy
```

The Vercel Cron job will automatically run at 9AM UTC weekdays once deployed.

---

## 📧 Adding User Emails to Supabase

Update the Clerk webhook handler (`app/api/webhooks/clerk/route.ts`) to also store the user's email in the `user_emails` table:

```ts
// After verifying the webhook, inside the 'user.created' handler:
await supabase.from('user_emails').upsert({
  user_id: evt.data.id,
  email: email,
  name: name,
})
```

This is already included in the webhook handler code.

---

*Not financial advice. Built for educational purposes.*
