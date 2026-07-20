# PulseDesk dashboard sidebar

Role-aware, collapsible, mobile-friendly sidebar for the two dashboard
surfaces: the company workspace (AGENT / ADMIN) and the platform surface
(SUPERADMIN).

## How the roles map to nav

| Login response          | `role` field | Nav shown        |
|--------------------------|--------------|-------------------|
| `data.agent.role`        | `AGENT`      | Inbox + My Conversations only |
| `data.agent.role`        | `ADMIN`      | Full company nav: Overview, Inbox, Agents, Widget, Knowledge Base, Analytics, Billing, Settings |
| `data.superAdmin`        | n/a          | Platform nav: Overview, Companies, Users, Escalations, Feature Flags, System Health, Billing, Roles, Settings |

The same `/auth/login` response shape is used to build a `DashboardSession`
(see `types/auth.ts`) — pass that straight into `<DashboardSidebar session={...} />`
once you've got real auth wired up. Until then, `app/dashboard/preview/page.tsx`
mocks all three sessions with a role switcher so you can see and click through
every variant right now.

## Files

```
types/auth.ts                          # Session types matching your login payloads
config/dashboard-nav.ts                # Per-role nav definitions + getNavSections()
components/dashboard/dashboard-sidebar.tsx   # The sidebar itself
app/dashboard/preview/page.tsx         # Standalone demo — no backend needed
```

## Dependencies

Everything here assumes your existing stack: `lucide-react`, `framer-motion`,
`@/lib/utils` (the `cn` helper), and the shadcn/ui primitives `button`, `badge`,
`separator`, `avatar`, `dropdown-menu`, `tooltip`, `sheet`. If any are missing:

```bash
npx shadcn@latest add button badge separator avatar dropdown-menu tooltip sheet
```

## One CSS addition

The sidebar uses shadcn's dedicated `--sidebar-*` tokens so it can have its
own tone independent of the main canvas (handy since dashboards often run a
touch darker/denser than the marketing site). Add these to `globals.css` if
they're not already there — tune the values to your PulseDesk palette:

```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
}

.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
}
```

And register them in `tailwind.config` (or your `@theme` block if you're on
Tailwind v4 CSS-first config, which this repo is):

```css
@theme inline {
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
}
```

## What's intentionally left as a stub

- `onLogout` — wire to your real logout call (revoke `tokenVersion`, clear
  tokens, redirect to `/login`).
- The "Available for chats" toggle on AGENT is local state only — hook it up
  to your realtime presence system once that phase starts.
- Badge counts (`Inbox: 5`, `Inbox: 12`) are hardcoded placeholders — feed
  them from your unread-conversation count once the realtime layer exists.
