# CLAUDE.md — Personal Portfolio Web

> Ficheiro de instruções para o Claude Code. Lê este ficheiro integralmente antes de qualquer tarefa.

---

## 📋 Visão Geral do Projeto

Portfolio web pessoal full-stack com foco em design arrojado, animações de nível profissional e integração com APIs externas. Serve como âncora pública para todos os outros projetos e como primeira impressão para recrutadores.

**URL de produção:** `https://[teu-domínio].com`
**Repositório:** `personal-portfolio`
**Deploy:** Vercel (automático no push para `main`)

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Next.js | 15.x | Framework principal (App Router) |
| React | 19.x | UI com Server Components |
| TypeScript | 5.x | Tipagem estrita em todo o projeto |
| Tailwind CSS | 4.x | Styling (usar a nova sintaxe v4 com `@import "tailwindcss"`) |
| Shadcn/ui | latest | Componentes de UI base |
| Framer Motion | latest | Micro-animações e transições de UI |
| GSAP + ScrollTrigger | 3.x | Animações complexas de scroll |
| React Three Fiber | 8.x | Renderização 3D (hero section) |
| Three.js | latest | Motor 3D subjacente ao R3F |
| @react-three/drei | latest | Helpers para R3F |

### Backend (Next.js Route Handlers)
| Tecnologia | Propósito |
|-----------|-----------|
| GitHub REST API v3 | Repos pinados, linguagens, estrelas, contribuições |
| Spotify Web API | Widget "Now Playing" |
| Resend | Envio de emails do formulário de contacto |
| Upstash Redis | View counters nos posts do blog, rate limiting |
| Next.js Edge Runtime | Funções rápidas para APIs externas |

### Conteúdo
| Tecnologia | Propósito |
|-----------|-----------|
| MDX | Posts do blog com componentes React embutidos |
| next-mdx-remote | Renderização de MDX em Server Components |
| gray-matter | Parsing de frontmatter dos posts |
| rehype-pretty-code | Syntax highlighting no blog (usa Shiki) |

### Deploy & Infraestrutura
| Tecnologia | Propósito |
|-----------|-----------|
| Vercel | Hosting, Edge Network, CI/CD automático |
| Vercel Analytics | Analytics de performance |
| Umami (self-hosted) | Analytics de visitas sem cookies (GDPR compliant) |

---

## 📁 Estrutura de Diretórios

```
personal-portfolio/
├── CLAUDE.md                    # Este ficheiro
├── .env.local                   # Variáveis de ambiente (nunca commitar)
├── .env.example                 # Template das variáveis (commitar)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, providers, analytics)
│   ├── page.tsx                 # Homepage (hero + secções)
│   ├── globals.css              # Tailwind v4 imports + CSS variables
│   │
│   ├── blog/
│   │   ├── page.tsx             # Lista de posts
│   │   └── [slug]/
│   │       └── page.tsx         # Post individual
│   │
│   └── api/
│       ├── github/
│       │   └── route.ts         # GitHub API (repos, stats)
│       ├── spotify/
│       │   └── route.ts         # Spotify Now Playing
│       ├── contact/
│       │   └── route.ts         # Formulário de contacto (Resend)
│       └── views/
│           └── [slug]/
│               └── route.ts     # View counter (Upstash)
│
├── components/
│   ├── ui/                      # Componentes Shadcn/ui (gerados)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/                # Secções da homepage
│   │   ├── Hero.tsx             # Hero 3D com R3F
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Blog.tsx
│   │   └── Contact.tsx
│   ├── three/                   # Componentes Three.js / R3F
│   │   ├── Scene.tsx            # Canvas principal R3F
│   │   └── [outros objetos 3D]
│   └── blog/
│       ├── MDXComponents.tsx    # Componentes custom para MDX
│       └── ViewCounter.tsx
│
├── lib/
│   ├── github.ts                # Funções para GitHub API
│   ├── spotify.ts               # Funções para Spotify API
│   ├── redis.ts                 # Cliente Upstash Redis
│   ├── resend.ts                # Cliente Resend
│   └── utils.ts                 # Utilitários gerais (cn, formatters)
│
├── content/
│   └── blog/                    # Posts MDX
│       └── [slug].mdx
│
├── public/
│   ├── images/
│   └── fonts/                   # Fontes self-hosted (performance)
│
└── types/
    └── index.ts                 # Tipos TypeScript globais
```

---

## 🎨 Design System

### Paleta de Cores (CSS Variables em `globals.css`)
- Usar modo dark como primário, com toggle para light.
- Paleta base: tons de cinzento escuro (`#0a0a0a`, `#111111`) com accent em cor vibrante (a definir — sugestão: electric blue `#3B82F6` ou emerald `#10B981`).
- Definir todas as cores como CSS custom properties, nunca hardcoded nos componentes.

### Tipografia
- **Heading:** Geist (Vercel) ou Cal Sans — self-hosted em `/public/fonts/`.
- **Body:** Inter — self-hosted.
- **Monospace (blog/código):** JetBrains Mono — self-hosted.
- Nunca usar Google Fonts CDN (GDPR + performance).

### Animações — Regras
- **GSAP ScrollTrigger:** Para animações de entrada de secções e efeitos de parallax.
- **Framer Motion:** Para hover states, page transitions, e micro-interações.
- **R3F/Three.js:** Apenas na hero section. Não abusar de 3D no resto da página.
- **Princípio:** Animações devem ter propósito. Sem animações decorativas vazias.
- **Performance:** Usar `will-change` com moderação. Testar no mobile. Respeitar `prefers-reduced-motion`.

---

## ⚙️ Variáveis de Ambiente

Cria sempre um `.env.example` atualizado. As variáveis necessárias são:

```bash
# GitHub
GITHUB_TOKEN=                    # Personal Access Token (scope: public_repo, read:user)
GITHUB_USERNAME=                 # O teu username do GitHub

# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=           # Obter via OAuth flow inicial

# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=               # ex: portfolio@teu-dominio.com
CONTACT_EMAIL=                   # Email onde recebes as mensagens

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=            # https://teu-dominio.com (sem trailing slash)
```

---

## 📐 Convenções de Código

### TypeScript
- `strict: true` no `tsconfig.json`. Sem `any` explícito.
- Tipos de resposta de API sempre definidos em `types/index.ts`.
- Usar `type` em vez de `interface` para consistência (exceto quando extending).

### Componentes React
- Server Components por defeito. Adicionar `"use client"` apenas quando necessário (interatividade, hooks de browser, GSAP, R3F).
- Props tipadas explicitamente. Sem props spreading desnecessário.
- Nomes de ficheiros: PascalCase para componentes, kebab-case para utilitários.

### Styling
- Tailwind v4: usar a sintaxe `@utility` e `@variant` quando necessário.
- Classes ordenadas pelo plugin `prettier-plugin-tailwindcss`.
- Sem CSS inline. Sem styled-components. Só Tailwind + CSS variables.
- Usar `cn()` de `lib/utils.ts` (clsx + tailwind-merge) para classes condicionais.

### API Routes
- Todas as route handlers com validação de input (usar Zod).
- Rate limiting em todos os endpoints públicos (via Upstash).
- Erros sempre retornam JSON com `{ error: string, status: number }`.
- Cache headers explícitos em todas as rotas (GitHub API: revalidate 3600s).

### Git
- Commits em inglês, formato conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Nunca commitar `.env.local` ou segredos.
- Branch `main` é produção. Desenvolver em feature branches.

---

## 🗂️ Sprints de Desenvolvimento

### Sprint 1 — Setup & Fundações
- [ ] Inicializar projeto Next.js 15 com TypeScript
- [ ] Configurar Tailwind CSS v4
- [ ] Instalar e configurar Shadcn/ui
- [ ] Setup de fontes self-hosted
- [ ] Estrutura de diretórios base
- [ ] Layout raiz (Navbar + Footer placeholder)
- [ ] Dark/Light mode com Tailwind e `next-themes`
- [ ] `.env.example` e validação de env vars com Zod

### Sprint 2 — Hero Section 3D
- [ ] Setup React Three Fiber + Drei no canvas
- [ ] Cena 3D interativa (responde ao mouse)
- [ ] Integrar GSAP para animação de entrada
- [ ] Texto animado com Framer Motion
- [ ] Responsivo e performance testada (mobile)
- [ ] Fallback para `prefers-reduced-motion`

### Sprint 3 — Secções de Conteúdo
- [ ] Secção About (bio, foto, timeline)
- [ ] Secção Skills (tecnologias com animação)
- [ ] Animações de entrada com GSAP ScrollTrigger em todas as secções

### Sprint 4 — Integração GitHub & Projetos
- [ ] Route handler `/api/github` com cache
- [ ] Secção Projects com dados reais da GitHub API
- [ ] Cards de projeto com hover animations
- [ ] Filtro por linguagem/categoria

### Sprint 5 — Blog MDX
- [ ] Setup MDX com next-mdx-remote
- [ ] Syntax highlighting com rehype-pretty-code
- [ ] View counter por post (Upstash Redis)
- [ ] Página de lista de posts
- [ ] Página de post individual
- [ ] Primeiro post de exemplo

### Sprint 6 — APIs Restantes & Contacto
- [ ] Spotify Now Playing widget
- [ ] Formulário de contacto (Resend)
- [ ] Rate limiting no formulário
- [ ] Validação de formulário (React Hook Form + Zod)

### Sprint 7 — Polimento & Deploy
- [ ] SEO: metadata, Open Graph, sitemap.xml, robots.txt
- [ ] Performance: bundle analysis, image optimization
- [ ] Lighthouse score > 95 em todas as métricas
- [ ] Deploy na Vercel
- [ ] Domínio personalizado + HTTPS
- [ ] Umami analytics self-hosted (opcional, pode ser post-deploy)

---

## 🚫 O Que NÃO Fazer

- Não usar `pages/` router. Todo o código vai em `app/`.
- Não usar `getServerSideProps` ou `getStaticProps` (são do pages router).
- Não instalar bibliotecas de animação redundantes (só GSAP + Framer Motion + R3F).
- Não criar API routes para dados que podem ser fetch no Server Component diretamente.
- Não usar `useEffect` para fetch de dados — usar Server Components ou SWR/React Query apenas quando necessário no cliente.
- Não commitar segredos nem o `.env.local`.
- Não usar `@ts-ignore` ou `as any`.

---

## 🔗 Recursos de Referência

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [Resend Docs](https://resend.com/docs)