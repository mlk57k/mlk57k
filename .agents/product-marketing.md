# Product Marketing Context — Glowy

## Product

**Name**: Glowy  
**Tagline**: Découvre l'âge réel de ta peau  
**URL**: https://mlk57k.vercel.app/  
**Category**: AI Skin Analysis SaaS  
**Language/Market**: French (France), B2C

## What it does

Glowy analyses a user's skin via webcam/photo upload using Claude AI (Anthropic). The scan returns:
- A skin score (0–100)
- A skin age estimate
- A list of detected skin issues
- A personalised skincare routine (locked behind paywall)

The routine and full results are unlocked by subscribing.

## Business Model

- **Free**: Scan + skin score preview + teaser of issues
- **Paid subscription** (Stripe):
  - Monthly: €7.99/month
  - Annual: €39/year (= €3.25/month, saves 60%)
  - 7-day free trial on all plans
- **Email capture**: Required to see full results (Supabase Auth magic link)

## Target Audience

- **Primary**: French women 18–35 interested in skincare (skincare enthusiasts, beauty influencers, everyday users)
- **Secondary**: French women 35–50 concerned with skin ageing
- **Pain points**: Don't know which products to buy, overwhelmed by skincare advice, want personalised guidance
- **Trigger moments**: After a breakout, before buying new skincare, wanting to track skin progress

## Key Value Props

1. AI-powered analysis in 30 seconds — no dermatologist needed
2. Personalised routine, not generic advice
3. Track skin progress over time (dashboard with score evolution chart)
4. Affordable (less than one skincare product/month)

## Funnel

```
Landing page → Take scan (webcam/photo) → Email capture → See score preview
→ Checkout (monthly/annual) → Unlock full routine → Dashboard
```

## Conversion goals

- **Primary CTA**: "Découvrir mon score de peau" (landing → scan)
- **Email capture rate**: After scan, before seeing results
- **Subscription conversion**: After seeing locked routine
- **Key pages**: `/` (landing), `/scan`, `/results/[id]`, `/checkout`, `/dashboard`

## Tech Stack

- Next.js 14 App Router (TypeScript)
- Supabase (auth + database)
- Stripe Checkout (subscriptions)
- Claude AI via Anthropic API (skin analysis)
- Vercel (hosting)
- Resend (transactional email)

## Brand

- **Tone**: Warm, scientific but accessible, empowering (never shame-y about skin)
- **Colors**: Coral (#f87c7c) primary, soft warm whites and neutrals
- **Fonts**: Clean sans-serif
- **Personality**: Like a knowledgeable skincare-savvy friend

## Competitors

- RÉDUIT, SkinVision, Revieve, YouCam Makeup (skin analysis features)
- Differentiator: French-first, Claude AI quality, affordable subscription vs one-time report

## Metrics to watch

- Scan-to-email capture rate
- Email-to-subscription conversion rate
- Monthly churn rate
- Scan-to-score page drop-off
