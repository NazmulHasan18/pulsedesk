# PulseDesk — Landing Page

The marketing landing page for **PulseDesk**, an AI-augmented live support
chat platform. Built with Next.js (App Router), TypeScript, Tailwind CSS v4,
and hand-rolled shadcn-style UI primitives (Radix + `class-variance-authority`).

> Note: this repo only ships the public landing page. The product itself
> (widget embed script, Socket.io realtime layer, Prisma schema, dashboards)
> is the next build phase.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** with a small custom design-token layer in `globals.css`
- **shadcn/ui-style primitives** — `Button`, `Card`, `Badge`, `Tabs`,
  `Accordion` — built manually on Radix UI + CVA (the `shadcn` CLI registry
  wasn't reachable from this build environment, so the components were
  authored directly following the same conventions; swap for CLI-managed
  ones anytime with `npx shadcn@latest add <component>`)
- **Framer Motion** for the interactive chat demo, scroll reveals, and the
  animated resolution-split chart
- **Lucide** icons
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code/embed
  snippet), loaded via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Structure

```
src/
  app/
    layout.tsx           Fonts + metadata
    page.tsx              Assembles the landing page sections
    globals.css            Design tokens, keyframes, base styles
  components/
    ui/                    Button, Card, Badge, Tabs, Accordion (shadcn-style)
    site/
      nav-bar.tsx              Sticky nav with scroll-aware blur
      hero.tsx                 Hero copy + stats strip
      chat-widget-demo.tsx     Signature piece: a fully interactive,
                                self-playing chat widget mock showing the
                                AI -> agent handoff (2 selectable scenarios)
      how-it-works.tsx         The real message pipeline (embed -> ask ->
                                route -> learn), interactive step switcher
      embed-section.tsx        The one-script-tag install, with a working
                                "copy to clipboard" snippet
      features.tsx             Feature grid mapped to the actual architecture
      dashboard-preview.tsx    Tabs mocking the widget / FAQ / inbox tabs of
                                the company dashboard
      stats-section.tsx        Animated AI-vs-agent resolution donut (maps
                                to the super-admin panel)
      faq-section.tsx          Accordion FAQ
      cta-section.tsx          Closing call to action
      footer.tsx
  lib/
    utils.ts                cn() class-merge helper
```

## Design notes

- **Palette**: paper (#F6F5F1) background with ink (#14171C) text, an
  indigo primary (#4B4FE0, the "sent message" color), and a signal-green /
  amber pair used consistently as an online-vs-AI-fallback status language
  throughout the page (nav pulse dot, widget header, feature icons,
  resolution chart).
- **Signature element**: the hero's interactive chat widget mock is a real,
  functioning component (not a static screenshot) that types out an AI
  answer, escalates to an agent, and lets you switch between two scripted
  support scenarios, because that handoff is the product.
- All interactive bits (how-it-works step switcher, dashboard tabs, embed
  copy button, resolution chart) are the real thing, not just styled to
  look interactive.

## Extending

The next milestone per the project brief is the Prisma schema (Company,
Agent, Conversation, Message, FaqDoc) and the actual widget/dashboard app
behind this landing page.
