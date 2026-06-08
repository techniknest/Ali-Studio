# Ali Studio — Full-Stack Web Platform

Professional cinematography and videography platform built by [TechnikNest Pvt Ltd](https://techniknest.com/).

## Tech Stack

- Next.js 15 (App Router)
- MongoDB + Mongoose
- NextAuth.js v5
- Cloudinary, Resend
- Tailwind CSS v4, Framer Motion

## Quick Start (Local)

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

## Vercel Deployment

### 1. Set these 5 environment variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your production URL |
| `BOOTSTRAP_ADMIN_EMAIL` | First admin email |
| `BOOTSTRAP_ADMIN_PASSWORD` | First admin password |
| `ENCRYPTION_KEY` | Exactly 32 characters |

### 2. Deploy

Connect the repo to Vercel and deploy. Node.js 20.x recommended.

### 3. First login

1. Visit `/admin/login`
2. Sign in with bootstrap credentials
3. Complete the **Setup Wizard** (MongoDB, Cloudinary, Resend, studio info)
4. Customize content from the admin dashboard

### 4. Update credentials later

Go to **Admin → Settings → Infrastructure** to update MongoDB, Cloudinary, or Resend keys anytime. Values are encrypted with AES-256-GCM using `ENCRYPTION_KEY`.

> **Warning:** Never lose your `ENCRYPTION_KEY`. Without it, encrypted credentials in the database cannot be recovered.

## Admin Routes

- `/admin/login` — Sign in
- `/admin/setup` — First-time setup wizard
- `/admin/dashboard` — Overview
- `/admin/settings/infrastructure` — API keys & connections
- `/admin/settings/account` — Change email/password

## License

Proprietary — Ali Studio / TechnikNest Pvt Ltd
