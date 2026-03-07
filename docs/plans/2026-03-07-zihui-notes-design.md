# Zihui Notes - Design Document

**Date**: 2026-03-07
**Status**: Approved

## Goal

Rebuild Reading-Notes as a vinext app: personal reading notes with GitHub OAuth, D1, R2 image storage, Markdown editor, modern UI matching homepage/vc_radar design language. Deploy to notes.zihuichen.com.

## Architecture

vinext (Next.js on Vite) + Cloudflare Workers + D1 + R2. GitHub OAuth for auth. Only `chenzihui222` can write; everyone else read-only.

## Data Model

- `notes`: id, title, author, content (Markdown), cover_url, created_at, updated_at
- `recommendations`: id, title, author, category, description, tags (JSON), cover_url
- `sessions`: id (token), github_id, github_login, created_at, expires_at

## API Routes

- GET /api/auth/login → redirect to GitHub OAuth
- GET /api/auth/callback → create session
- POST /api/auth/logout → clear session
- GET /api/notes → list notes
- POST /api/notes → create (admin only)
- PUT /api/notes/[id] → edit (admin only)
- DELETE /api/notes/[id] → delete (admin only)
- POST /api/upload → upload image to R2 (admin only)

## Pages

- / → note cards grid + recommendations
- /note/[id] → note detail (Markdown rendered)
- /write → Markdown editor (admin only)
- /edit/[id] → edit note (admin only)

## UI

Bricolage Grotesque + JetBrains Mono, #f38020 accent, #f5f6f8 bg, white cards, 2px accent bar.

## Image Handling

Client-side resize (1200px width, max 2400px height crop) + WebP conversion before upload to R2.

## Markdown

react-markdown + remark-gfm for rendering. Split-pane editor (textarea + live preview).
