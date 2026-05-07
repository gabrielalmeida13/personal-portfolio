# 🗺️ Roadmap de Projetos Pessoais

> Projetos ordenados por dependência lógica e impacto no currículo.
> Cada projeto é funcional no dia a dia e demonstrável em entrevistas.

---

## ✅ Estado Geral

| # | Projeto | Stack Principal | Status |
|---|---------|-----------------|--------|
| 1 | [Personal Portfolio Web](#1-personal-portfolio-web) | Next.js 15, R3F, GSAP | 🔄 Em curso |
| 2 | [Personal Drive (Self-Hosted)](#2-personal-drive-self-hosted) | Go, React, Docker, Cloudflare Tunnel | ⏳ Pendente |
| 3 | [Plataforma de Streaming Pessoal](#3-plataforma-de-streaming-pessoal) | Jellyfin, Next.js, Go | ⏳ Pendente |
| 4 | [Gestor de Passwords Zero-Knowledge](#4-gestor-de-passwords-zero-knowledge) | Web Crypto API, Node.js, Browser Extension | ⏳ Pendente |
| 5 | [HomeLab Dashboard](#5-homelab-dashboard) | React, WebSockets, Prometheus, Docker | ⏳ Pendente |
| 6 | [CI/CD Pipeline Caseiro](#6-cicd-pipeline-caseiro) | Go, Docker, Webhooks, Self-Hosted | ⏳ Pendente |

---

## 1. Personal Portfolio Web

**Objetivo:** Âncora pública de todos os outros projetos. Ponto de entrada para recrutadores e colaboradores.

**Utilidade Real:** Substitui o LinkedIn como primeira impressão técnica. Inclui blog técnico próprio.

**Funcionalidades:**
- Hero section 3D interativa (Three.js / React Three Fiber)
- Animações de scroll complexas (GSAP ScrollTrigger)
- Secção de projetos integrada com a GitHub API (repos, estrelas, linguagens)
- Blog técnico em MDX com view counters
- Widget "Now Playing" do Spotify
- Formulário de contacto funcional (Resend API)
- Analytics self-hosted (Umami)
- Dark/Light mode com transição animada

**Stack:**
- Framework: Next.js 15 (App Router, React 19, Server Components)
- 3D & Animações: React Three Fiber, GSAP, Framer Motion
- Styling: Tailwind CSS v4, Shadcn/ui
- Backend/API: Next.js Route Handlers + Edge Functions
- Base de Dados: Upstash Redis (view counters, rate limiting)
- Email: Resend
- Deploy: Vercel

**Impacto no CV:** Demonstra domínio de full-stack moderno, animações avançadas, e integração com APIs externas. É o projeto que os recrutadores vêem primeiro.

---

## 2. Personal Drive (Self-Hosted)

**Objetivo:** Substituir Google Drive / Dropbox com controlo total dos dados.

**Utilidade Real:** Backup de ficheiros pessoais, partilha de ficheiros grandes, sincronização entre dispositivos.

**Funcionalidades:**
- Web UI com drag-and-drop, zip/unzip, multi-janela
- Upload assíncrono com chunking para ficheiros grandes (filmes, backups)
- Geração de links de partilha temporários com expiração
- Acesso remoto via Cloudflare Tunnel (sem port-forwarding)
- Autenticação JWT com refresh tokens
- Quotas de armazenamento por utilizador

**Stack:**
- Backend: Go (performance + concorrência nativa para uploads)
- Frontend: React + Zustand (gestão de estado do explorador)
- Base de Dados: PostgreSQL (metadados) + sistema de ficheiros local
- Infraestrutura: Docker Compose (app + DB + Cloudflare Tunnel agent)
- Túnel: Cloudflare Tunnel ou Tailscale

**Impacto no CV:** Go em produção, sistemas de ficheiros, chunked uploads, infraestrutura Docker real. Raro em portfólios de estudantes.

---

## 3. Plataforma de Streaming Pessoal

**Objetivo:** Streaming de filmes e séries sem latência, sem subscrições, a partir do servidor pessoal.

**Utilidade Real:** Substitui Netflix/HBO no dia a dia, com acesso a qualquer conteúdo que possuas.

**Abordagem:** Jellyfin como motor de transcodificação (não reinventar a roda). Construir um frontend/cliente personalizado por cima da API do Jellyfin.

**Funcionalidades:**
- Frontend custom com UI moderna (melhor que o Jellyfin nativo)
- Reprodutor de vídeo com HLS streaming adaptativo
- Sistema de recomendações simples baseado em histórico de visualização
- Apps mobile-first (Progressive Web App)
- Integração com TMDB API (metadados, posters, trailers)
- Perfis de utilizador com histórico sincronizado

**Stack:**
- Backend de Media: Jellyfin (self-hosted, open-source)
- Frontend Custom: Next.js 15 + Video.js ou Vidstack
- Metadados: TMDB API
- Base de Dados: PostgreSQL (perfis, histórico)
- Deploy: Docker + Cloudflare Tunnel (reutiliza infraestrutura do Projeto 2)

**Impacto no CV:** Streaming adaptativo (HLS), integração com APIs complexas, reutilização de infraestrutura existente. Demonstra maturidade de arquitetura.

---

## 4. Gestor de Passwords Zero-Knowledge

**Objetivo:** Gestor de passwords com encriptação total do lado do cliente. O servidor nunca vê dados em claro.

**Utilidade Real:** Substitui LastPass/1Password com controlo total. Uso diário em todos os dispositivos.

**Funcionalidades:**
- Extensão de browser (Chrome/Firefox) como cliente principal
- Encriptação AES-GCM com chave derivada por PBKDF2 da Master Password
- Autofill inteligente de formulários de login
- Gerador de passwords com critérios configuráveis
- Importação/Exportação (Bitwarden, 1Password, CSV, JSON)
- Backend como "dumb storage" (apenas armazena blobs encriptados)
- Sincronização entre dispositivos via backend

**Stack:**
- Extensão: TypeScript, React (popup), Web Crypto API
- Backend: Node.js + Express (ou Go)
- Base de Dados: PostgreSQL
- Autenticação: SRP (Secure Remote Password) — o servidor nunca vê a password
- Deploy: Docker (reutiliza infraestrutura existente)

**Impacto no CV:** Criptografia aplicada, extensões de browser, segurança a nível profissional. Um dos projetos mais técnicos e diferenciadores do mercado.

---

## 5. HomeLab Dashboard

**Objetivo:** Painel unificado para monitorizar e gerir todos os serviços self-hosted dos projetos anteriores.

**Utilidade Real:** Ver em tempo real o estado de todos os contentores, métricas de sistema, logs, e alertas. Essencial quando tens 4+ projetos a correr.

**Funcionalidades:**
- Dashboard em tempo real com WebSockets (CPU, RAM, disco, rede)
- Estado de todos os contentores Docker com ações (start/stop/restart)
- Logs agregados por serviço com pesquisa
- Alertas configuráveis (email/webhook quando serviço cai)
- Métricas históricas com gráficos (Prometheus + Grafana embutido)
- Reverse proxy management (ver/adicionar rotas Nginx/Caddy)

**Stack:**
- Backend: Go + WebSockets (Docker SDK para interação com containers)
- Frontend: React + Recharts/D3.js (dashboards em tempo real)
- Métricas: Prometheus + Node Exporter
- Logs: Loki ou agregação custom
- Deploy: Docker (monitoriza o próprio Docker host)

**Impacto no CV:** DevOps real, WebSockets, Docker SDK, observabilidade. Transversal a qualquer empresa de tecnologia.

---

## 6. CI/CD Pipeline Caseiro

**Objetivo:** Mini-GitHub Actions próprio que faz deploy automático de todos os projetos anteriores.

**Utilidade Real:** Push para main → testes → build → deploy automático em todos os projetos. Zero intervenção manual.

**Funcionalidades:**
- Servidor de webhooks que recebe eventos do GitHub
- Runner de pipelines com isolamento por contentor Docker
- Definição de pipelines em YAML (semelhante ao GitHub Actions)
- Dashboard web para ver estado dos deploys e logs em tempo real
- Notificações (email/Discord) de sucesso/falha
- Rollback automático se o health check falhar após deploy
- Suporte a secrets encriptados por pipeline

**Stack:**
- Backend (Pipeline Runner): Go (concorrência para pipelines paralelas)
- Frontend (Dashboard): React + WebSockets (logs em tempo real)
- Execução: Docker-in-Docker (dind) isolado por pipeline
- Integração: GitHub Webhooks API
- Deploy: Corre no próprio servidor, gere os outros projetos

**Impacto no CV:** O projeto mais avançado em DevOps. Demonstra compreensão profunda de CI/CD, Docker, e automação de infraestrutura. Fecha o ciclo de todos os projetos anteriores.

---

## 📊 Mapa de Dependências

```
Portfolio (1) ──────────────────────────────────► Deploy independente (Vercel)
                                                    │
Personal Drive (2) ──► estabelece infraestrutura Docker + Cloudflare Tunnel
                │                                   │
Streaming (3) ──┘ reutiliza infraestrutura           │
                                                    │
Password Manager (4) ──► reutiliza infraestrutura  │
                                                    │
HomeLab Dashboard (5) ──► monitoriza projetos 2,3,4 │
                                                    │
CI/CD Pipeline (6) ──────────────────────────────── └── automatiza deploy de todos
```

---

## 🎯 Métricas de Sucesso

- [ ] Todos os projetos com README detalhado e documentação técnica
- [ ] Cada projeto com testes (unitários + integração)
- [ ] Todos os projetos containerizados e com docker-compose funcional
- [ ] Portfolio web com métricas de performance (Lighthouse > 95)
- [ ] Projetos 2-6 a correr em produção no servidor pessoal