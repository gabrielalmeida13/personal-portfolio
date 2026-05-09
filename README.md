# Gabriel Almeida — Personal Portfolio

A full-stack personal portfolio built with Next.js 16, featuring live API integrations, 3D animations, and an MDX blog. Designed with a dark-first aesthetic, smooth animations, and performance as a first-class concern.

---

## Features

### Live Integrations
- **GitHub API** — Pinned repos, language stats, and contribution data fetched server-side with a 1-hour cache
- **Spotify API** — Real-time "Now Playing" widget showing the current track with album art
- **Resend** — Contact form with email delivery, Zod validation, and rate limiting
- **Upstash Redis** — Blog post view counters and API rate limiting via Edge-compatible Redis

### UI & Animations
- **Bento Grid layout** — Cards expand into full overlays with Framer Motion `layoutId` morphing; collapsed cards retreat to a chip strip while content is open
- **Expandable blocks** — Hero, Research, CTF, JeKnowledge, GitHub, Skills, and Contact each have a collapsed and an expanded view
- **Framer Motion** — Shared layout animations, hover states, page transitions, and micro-interactions
- **Dark/Light mode** — System-aware with manual toggle via `next-themes`

### Blog
- MDX posts with embedded React components
- Syntax highlighting via `rehype-pretty-code` (Shiki)
- Per-post view counters stored in Redis
- Frontmatter-driven metadata (title, date, description, tags)

### Technical
- Next.js 16 App Router with React Server Components by default
- TypeScript `strict` mode throughout
- Tailwind CSS v4 with CSS custom properties for theming
- Edge Runtime on all API routes for low-latency responses
- Self-hosted fonts (Inter, Geist, JetBrains Mono) — no Google Fonts CDN

---

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4, Shadcn/ui |
| Animations | Framer Motion 12 (layout animations, shared layoutId) |
| APIs | GitHub REST v3, Spotify Web API, Resend, Upstash Redis |
| Content | MDX, next-mdx-remote, rehype-pretty-code |
| Deploy | Vercel (Edge Network, automatic CI/CD) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

```bash
git clone https://github.com/your-username/personal-portfolio.git
cd personal-portfolio
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Personal Access Token with `public_repo`, `read:user` scopes |
| `GITHUB_USERNAME` | Your GitHub username |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Long-lived token from the OAuth flow |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `RESEND_FROM_EMAIL` | Sender address (e.g. `portfolio@yourdomain.com`) |
| `CONTACT_EMAIL` | Where contact form submissions are delivered |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, no trailing slash |

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout (fonts, providers)
│   ├── globals.css           # Tailwind v4 + CSS variables
│   ├── blog/                 # Blog list + [slug] pages
│   └── api/
│       ├── github/           # GitHub stats endpoint
│       ├── spotify/          # Now Playing endpoint
│       ├── contact/          # Contact form (Resend)
│       └── views/[slug]/     # View counter (Upstash)
├── components/
│   ├── bento/
│   │   ├── BentoGrid.tsx     # Main grid — expand/collapse state machine
│   │   ├── CompactHero.tsx   # Mini header shown when a block is expanded
│   │   ├── RetreatedStrip.tsx# Collapsed block chips during expanded view
│   │   ├── ExpandedOverlay.tsx# Full-screen overlay with layoutId morph
│   │   ├── types.ts          # BlockId union type
│   │   └── blocks/           # HeroBlock, GitHubBlock, SkillsBlock, CTFBlock, etc.
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # Shadcn/ui base components
├── lib/
│   ├── github.ts             # GitHub API helpers
│   ├── spotify.ts            # Spotify API helpers
│   ├── redis.ts              # Upstash client
│   ├── resend.ts             # Resend client
│   └── utils.ts              # cn(), formatters
├── content/blog/             # MDX posts
├── public/                   # Static assets, fonts
└── types/index.ts            # Shared TypeScript types
```

---

## API Routes

| Route | Method | Description | Cache |
|---|---|---|---|
| `/api/github` | GET | Pinned repos, language stats | 1 hour |
| `/api/spotify` | GET | Currently playing track | 30 seconds |
| `/api/contact` | POST | Send contact email via Resend | — |
| `/api/views/[slug]` | GET / POST | Read / increment post view count | — |

All routes run on the Edge Runtime and include input validation via Zod. Public POST endpoints are rate-limited via Upstash Redis.

---

## Deploy

The project deploys automatically to Vercel on every push to `main`.

```bash
# Manual deploy via Vercel CLI
vercel --prod
```

Make sure all environment variables are set in the Vercel project dashboard before deploying.

---

## License

MIT
