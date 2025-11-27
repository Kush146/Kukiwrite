# FluxWrite - AI Content Automation Platform

A complete, production-ready AI SaaS application built with Next.js 14, featuring AI-powered content generation tools, user authentication, and Stripe subscriptions.

## Features

- 🤖 **AI Content Tools**
  - Blog Post Generator
  - YouTube Script Generator
  - SEO Content Optimizer
  - Content Rewriter

- 🔐 **Authentication**
  - Email/Password authentication
  - Google OAuth (optional)
  - Secure session management

- 💳 **Stripe Integration**
  - Free plan (50 generations/month)
  - Pro plan (unlimited generations)
  - Subscription management
  - Webhook handling

- 📊 **Usage Tracking**
  - Real-time usage monitoring
  - Plan-based limits
  - Usage visualization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **Payments**: Stripe
- **AI**: OpenAI API (GPT-4o-mini)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file with:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `STRIPE_PRICE_ID_PRO`: Your Stripe Pro plan price ID
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (optional, for Google OAuth)

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stripe Setup

1. **Create a Product and Price in Stripe Dashboard:**
   - Go to Products → Add Product
   - Create a "Pro" subscription product
   - Set up a recurring price (e.g., $29/month)
   - Copy the Price ID (starts with `price_`)
   - Add it to your `.env` as `STRIPE_PRICE_ID_PRO`

2. **Set up Webhooks:**
   - Go to Developers → Webhooks in Stripe Dashboard
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

3. **For local development:**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy the webhook secret from the CLI output

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── billing/
│   │   ├── settings/
│   │   └── tools/       # AI tool pages
│   ├── (marketing)/     # Public marketing pages
│   │   └── page.tsx     # Landing page
│   └── api/             # API routes
│       ├── auth/        # NextAuth routes
│       ├── stripe/      # Stripe integration
│       ├── tools/       # AI tool endpoints
│       └── user/        # User management
├── components/
│   ├── layout/          # Layout components
│   ├── providers/       # Context providers
│   └── ui/              # Reusable UI components
├── lib/                 # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── openai.ts        # OpenAI integration
│   ├── prisma.ts        # Prisma client
│   ├── session.ts       # Session helpers
│   ├── stripe.ts        # Stripe client
│   └── usage.ts         # Usage tracking
└── types/               # TypeScript definitions
```

## Key Features Implementation

### Authentication
- Credentials provider with bcrypt password hashing
- Optional Google OAuth
- Protected routes with automatic redirects
- Session management with JWT

### Usage Limits
- Free plan: 50 generations/month
- Pro plan: 10,000 generations/month (effectively unlimited)
- Real-time usage tracking
- Visual usage indicators

### AI Tools
- Blog Post Generator: Creates comprehensive blog posts
- YouTube Script Generator: Generates video scripts with hooks and CTAs
- SEO Content Optimizer: Provides SEO strategies and keyword optimization
- Content Rewriter: Rewrites content with different tones and styles

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Set environment variables** in your hosting platform

4. **Deploy** to Vercel, Railway, or your preferred platform

## Manual Steps Required

1. ✅ Set up PostgreSQL database
2. ✅ Configure environment variables in `.env`
3. ✅ Run Prisma migrations: `npx prisma migrate dev`
4. ✅ Create Stripe product and get Price ID
5. ✅ Set up Stripe webhook endpoint
6. ✅ Add webhook secret to `.env`
7. ✅ (Optional) Configure Google OAuth credentials

## TODOs for Production

- [ ] Add email verification
- [ ] Implement password reset functionality
- [ ] Add rate limiting to API routes
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add analytics
- [ ] Implement API access for Pro users
- [ ] Add more AI models/options
- [ ] Add content export features
- [ ] Implement content history/management

## License

MIT
