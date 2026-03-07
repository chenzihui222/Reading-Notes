# Zihui Notes

私人快速笔记工具 —— 随时随地记录想法、灵感和学习笔记。

**线上地址**: https://notes.zihuichen.com

---

## 目录

- [这个项目是什么？](#这个项目是什么)
- [技术栈总览](#技术栈总览)
- [架构图](#架构图)
- [项目结构详解](#项目结构详解)
  - [app/ — 前端页面和 API](#app--前端页面和-api)
  - [lib/ — 后端逻辑](#lib--后端逻辑)
  - [worker/ — Cloudflare Workers 入口](#worker--cloudflare-workers-入口)
  - [migrations/ — 数据库迁移](#migrations--数据库迁移)
  - [配置文件](#配置文件)
- [数据库设计](#数据库设计)
  - [当前表结构](#当前表结构)
  - [迁移历史](#迁移历史)
- [认证与权限](#认证与权限)
- [数据流：一条笔记从创建到显示的完整路径](#数据流一条笔记从创建到显示的完整路径)
- [前端设计细节](#前端设计细节)
- [本地开发指南](#本地开发指南)
- [部署到 Cloudflare](#部署到-cloudflare)
- [常用命令速查](#常用命令速查)

---

## 这个项目是什么？

Zihui Notes 是一个私人快速笔记工具。核心理念是 **方便** —— 打开网页就能写，写完即保存。

功能：
- **快速记录**：一个文本框，写完按 ⌘+Enter 即可保存
- **引用来源**：每条笔记可以附带一个引用（URL 或文字），URL 自动变成可点击的链接
- **点赞互动**：登录用户可以对笔记点赞，显示点赞者的 GitHub 头像
- **GitHub 登录**：通过 GitHub OAuth 认证身份
- **管理功能**：管理员可以创建和删除笔记

---

## 技术栈总览

| 层 | 技术 | 作用 |
|----|------|------|
| **框架** | vinext (Next.js 16 on Vite) | 用 Next.js 的写法（App Router、Server Components、API Routes），底层用 Vite 打包，部署到 Cloudflare |
| **前端** | React 19 | 页面交互（笔记创建、点赞、删除） |
| **运行环境** | Cloudflare Workers | 代码运行在 Cloudflare 全球边缘节点 |
| **数据库** | Cloudflare D1 (SQLite) | 存储笔记、点赞记录、用户会话 |
| **认证** | GitHub OAuth | 用户登录和身份验证 |
| **构建工具** | Vite 7 + TypeScript | 代码打包和类型检查 |
| **域名** | notes.zihuichen.com | 通过 Cloudflare Workers Custom Domain 绑定 |

---

## 架构图

```
用户浏览器
    |
    | 访问 notes.zihuichen.com
    v
┌─────────────────────────────────────────────────────┐
│              Cloudflare Workers (边缘节点)             │
│                                                      │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   vinext    │  │  API Routes  │  │  GitHub      │  │
│  │   (SSR)     │  │              │  │  OAuth       │  │
│  │            │  │ /api/notes   │  │              │  │
│  │ 服务端渲染  │  │ /api/notes/  │  │ /api/auth/   │  │
│  │ 首页 HTML   │  │  [id]/like   │  │ login        │  │
│  └─────┬──────┘  └─────┬──────┘  │ callback     │  │
│        │               │          │ logout       │  │
│        │               │          └──────┬──────┘  │
│        └───────────────┴─────────────────┘          │
│                        │                             │
│              ┌─────────┴─────────┐                   │
│              │        D1         │                   │
│              │     (SQLite)      │                   │
│              │                   │                   │
│              │  notes 表         │                   │
│              │  likes 表         │                   │
│              │  sessions 表      │                   │
│              └───────────────────┘                   │
└─────────────────────────────────────────────────────┘
         │
         │ OAuth 回调
         v
    GitHub API
    (用户身份验证)
```

简单来说：
1. **用户访问网站**，vinext 在服务端从 D1 读取笔记和点赞数据，渲染成 HTML 返回
2. **浏览器拿到页面后**，React 接管交互（写笔记、点赞、删除）
3. **交互操作**通过 API Routes 与 D1 数据库通信

---

## 项目结构详解

```
zihui_notes/
├── app/                          # 前端页面和 API
│   ├── layout.tsx                # 根布局 —— HTML 外壳、字体加载
│   ├── page.tsx                  # 首页 —— 服务端组件，从 D1 读数据
│   ├── home.tsx                  # 客户端交互组件 —— 笔记创建、点赞、背景效果
│   ├── globals.css               # 全局样式（网格纸主题、动画、响应式）
│   └── api/
│       ├── notes/
│       │   ├── route.ts          # GET /api/notes（获取所有笔记）
│       │   │                       POST /api/notes（创建笔记，需管理员权限）
│       │   └── [id]/
│       │       ├── route.ts      # DELETE /api/notes/:id（删除笔记，需管理员权限）
│       │       └── like/
│       │           └── route.ts  # POST /api/notes/:id/like（点赞/取消点赞，需登录）
│       └── auth/
│           ├── login/route.ts    # GET  —— 重定向到 GitHub OAuth 授权页
│           ├── callback/route.ts # GET  —— GitHub 回调，交换 token、创建会话
│           └── logout/route.ts   # POST —— 清除会话 cookie
├── lib/                          # 后端业务逻辑
│   ├── db.ts                     # 数据库操作（笔记 CRUD、点赞、会话管理）
│   ├── auth.ts                   # 认证逻辑（session cookie、用户身份、管理员判断）
│   └── env.ts                    # Cloudflare 环境变量获取
├── worker/                       # Cloudflare Workers 入口
│   └── index.ts                  # HTTP 请求入口（vinext 自动生成）
├── migrations/                   # 数据库迁移文件（按顺序执行）
│   ├── 0001_init.sql             # 初始建表（旧版书评结构，已被 0003 替代）
│   ├── 0003_simplify.sql         # 简化为快速笔记结构
│   └── 0004_likes.sql            # 添加点赞表
├── vite.config.ts                # Vite 构建配置
├── wrangler.jsonc                # Cloudflare Workers 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 依赖和脚本命令
```

---

### app/ — 前端页面和 API

#### `app/layout.tsx` — 根布局

所有页面共享的 HTML 外壳。定义了：
- `<html lang="zh-CN">` —— 中文页面
- Google Fonts 加载：**Bricolage Grotesque**（标题/正文）和 **JetBrains Mono**（等宽字体，用于时间戳、引用等）
- 引入全局样式 `globals.css`
- 页面 metadata（标题和描述）

#### `app/page.tsx` — 首页（服务端组件）

服务端组件，在 Workers 上运行。做两件事：
1. 从请求的 Cookie 中识别当前用户身份
2. 从 D1 查询所有笔记（含点赞数据）

然后把 `notes` 和 `user` 作为 props 传给客户端组件 `<HomePage>`。

```
用户请求 → 服务端执行 page.tsx → 查询 D1 → 渲染 HTML → 返回浏览器
```

#### `app/home.tsx` — 客户端交互组件

文件顶部的 `"use client"` 标记，表示这个组件在浏览器运行。包含以下子组件：

| 组件 | 功能 |
|------|------|
| `QuickCapture` | 笔记输入框 + 引用输入 + ⌘+Enter 快捷保存 |
| `NoteItem` | 单条笔记的展示：内容、引用链接、时间、删除按钮 |
| `LikeButton` | 点赞按钮 + 点赞者头像展示，支持乐观更新 |
| `SiteFooter` | 页脚：项目链接、GitHub、版权信息 |
| `useGridBackground()` | Canvas 网格纸背景动画 + 鼠标交互 ripple 效果 |

**背景效果**：使用 Canvas 在淡黄色底色上绘制网格线和网格交叉点。鼠标移动时，附近的网格点会被推开并变色（灰→橙），点之间会出现橙色连接线，鼠标离开后弹簧回弹。适配了 `devicePixelRatio` 以在 Retina 屏幕上保持清晰。

#### `app/globals.css` — 全局样式

设计系统采用 CSS 变量，主要特征：
- 淡黄色网格纸背景（`--bg: #fdf8ee`）
- 橙色作为强调色（`--accent: #f38020`）
- 半透明白色卡片（`--card: rgba(255,255,255,0.85)`）
- 入场动画（`fadeUp` + 交错延迟）
- 点赞按钮弹跳动画（`likePop`）
- 移动端响应式适配（640px 断点）

#### API Routes

| 路由 | 方法 | 功能 | 权限 |
|------|------|------|------|
| `/api/notes` | GET | 获取所有笔记（含点赞） | 公开 |
| `/api/notes` | POST | 创建新笔记 | 管理员 |
| `/api/notes/:id` | DELETE | 删除笔记 | 管理员 |
| `/api/notes/:id/like` | POST | 点赞/取消点赞（toggle） | 登录用户 |
| `/api/auth/login` | GET | 跳转 GitHub 授权页 | 公开 |
| `/api/auth/callback` | GET | GitHub OAuth 回调 | 公开 |
| `/api/auth/logout` | POST | 退出登录 | 公开 |

---

### lib/ — 后端逻辑

#### `lib/db.ts` — 数据库操作

所有 D1 数据库交互封装在这个文件中：

| 函数 | 作用 |
|------|------|
| `getNotes()` | 查询所有笔记，并批量查询每条笔记的点赞列表，合并返回 |
| `createNote()` | 插入新笔记，返回自增 ID |
| `deleteNote()` | 删除笔记及其关联的点赞记录 |
| `toggleLike()` | 切换点赞状态：已赞则取消，未赞则添加 |
| `createSession()` | 创建登录会话 |
| `getSession()` | 根据 session ID 查询会话（自动过滤已过期的） |
| `deleteSession()` | 删除会话（退出登录时调用） |

`getNotes()` 的实现细节：先查 notes 表，再用 `WHERE note_id IN (...)` 批量查 likes 表，在内存中合并。避免了 N+1 查询问题。

#### `lib/auth.ts` — 认证逻辑

- 从请求的 Cookie 中提取 session ID
- 查询 D1 中的 sessions 表验证身份
- 判断是否为管理员（对比 GitHub 用户名列表）
- Session cookie 设置：`HttpOnly; Secure; SameSite=Lax; Max-Age=604800`（7 天过期）

#### `lib/env.ts` — 环境变量

封装 Cloudflare Workers 的环境变量获取。在 Workers 中，环境变量不通过 `process.env` 获取，而是通过 `cloudflare:workers` 模块。

提供 `DB`（D1 数据库）、`GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET` 三个绑定。

---

### worker/ — Cloudflare Workers 入口

#### `worker/index.ts`

由 vinext 框架自动生成的 Workers 入口文件。每当 HTTP 请求到达时，Workers 调用此文件的 `fetch()` 函数，由 vinext 路由到对应的页面或 API。

---

### migrations/ — 数据库迁移

按编号顺序执行的 SQL 文件，用于版本控制数据库结构。

| 文件 | 内容 | 说明 |
|------|------|------|
| `0001_init.sql` | 创建旧版表（notes、recommendations、sessions） | 初始版本，已被 0003 替代 |
| `0003_simplify.sql` | 删除旧表，创建新的简化 notes 表 | 从书评模式转为快速笔记模式 |
| `0004_likes.sql` | 创建 likes 表 | 添加点赞功能 |

> 注意：编号 0002 是历史遗留的 seed 数据文件，已删除。

---

### 配置文件

#### `wrangler.jsonc` — Cloudflare Workers 配置

```jsonc
{
  "name": "zihui-notes",                // Workers 项目名
  "main": "worker/index.ts",            // 入口文件
  "compatibility_date": "2026-03-01",    // Workers 运行时版本
  "compatibility_flags": ["nodejs_compat"], // Node.js 兼容模式
  "workers_dev": true,                   // 同时启用 workers.dev 域名
  "d1_databases": [{
    "binding": "DB",                     // 代码中用 env.DB 访问
    "database_name": "zihui-notes-db",
    "database_id": "698723a3-...",
    "migrations_dir": "migrations"
  }],
  "vars": {
    "GITHUB_CLIENT_ID": "Ov23li..."      // GitHub OAuth App 的 Client ID
  },
  "routes": [
    { "pattern": "notes.zihuichen.com", "custom_domain": true }
  ],
  "r2_buckets": [{                       // R2 存储桶（历史遗留，暂未使用）
    "binding": "IMAGES",
    "bucket_name": "zihui-notes-images"
  }]
}
```

`GITHUB_CLIENT_SECRET` 通过 `wrangler secret` 设置，不会出现在配置文件中。

#### `vite.config.ts` — Vite 构建配置

```ts
plugins: [
  vinext(),       // vinext 框架插件（处理 App Router、SSR、RSC）
  cloudflare()    // Cloudflare 插件（打包为 Workers 格式）
]
```

#### `tsconfig.json` — TypeScript 配置

- `"types": ["@cloudflare/workers-types/experimental"]`：提供 Workers API 类型
- `"paths": { "@/*": ["./*"] }`：路径别名，`@/lib/db` 解析为 `./lib/db`

---

## 数据库设计

### 当前表结构

项目使用 Cloudflare D1（托管 SQLite），包含 3 张表：

#### notes 表 — 笔记

```sql
CREATE TABLE notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  content     TEXT NOT NULL,          -- 笔记内容
  reference   TEXT DEFAULT '',        -- 引用来源（URL 或文字）
  created_at  TEXT DEFAULT (datetime('now'))  -- 创建时间（UTC）
);
CREATE INDEX idx_notes_created ON notes(created_at DESC);
```

#### likes 表 — 点赞

```sql
CREATE TABLE likes (
  note_id     INTEGER NOT NULL,       -- 关联的笔记 ID
  github_id   INTEGER NOT NULL,       -- 点赞者的 GitHub 用户 ID
  github_login TEXT NOT NULL,         -- 点赞者的 GitHub 用户名（用于显示头像）
  created_at  TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (note_id, github_id)    -- 联合主键，防止重复点赞
);
```

点赞者头像通过 `https://avatars.githubusercontent.com/u/{github_id}?s=32` 直接从 GitHub 获取，无需额外存储。

#### sessions 表 — 登录会话

```sql
CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,       -- 随机生成的 session ID（64 字符十六进制）
  github_id   INTEGER NOT NULL,       -- GitHub 用户 ID
  github_login TEXT NOT NULL,         -- GitHub 用户名
  created_at  TEXT DEFAULT (datetime('now')),
  expires_at  TEXT NOT NULL           -- 过期时间（创建后 7 天）
);
```

### 迁移历史

数据库经历了一次重大重构：

1. **0001_init.sql**（初始版本）：创建了 `notes`（书评）、`recommendations`（推荐书目）、`sessions` 三张表。notes 表包含 title、author、content、cover_url 等书评相关字段。

2. **0003_simplify.sql**（简化重构）：删除了 `notes` 和 `recommendations` 表，重建了全新的 `notes` 表，只保留 `content`（笔记内容）和 `reference`（引用来源）两个核心字段。这次迁移标志着项目从"读书笔记/书评网站"转型为"快速笔记工具"。

3. **0004_likes.sql**（添加点赞）：创建 `likes` 表，支持登录用户对笔记点赞。

**执行迁移的方式**：

```bash
# 本地
wrangler d1 execute zihui-notes-db --local --file=migrations/0004_likes.sql

# 线上
wrangler d1 execute zihui-notes-db --remote --file=migrations/0004_likes.sql
```

---

## 认证与权限

### GitHub OAuth 流程

```
1. 用户点击 "Sign in"
       |
2. 重定向到 GitHub 授权页
   GET https://github.com/login/oauth/authorize
       ?client_id=xxx
       &redirect_uri=https://notes.zihuichen.com/api/auth/callback
       &scope=read:user
       |
3. 用户在 GitHub 授权后，GitHub 重定向回
   GET /api/auth/callback?code=xxx
       |
4. 服务端用 code 向 GitHub 交换 access_token
   POST https://github.com/login/oauth/access_token
       |
5. 用 access_token 调用 GitHub API 获取用户信息
   GET https://api.github.com/user
       |
6. 创建 session 存入 D1，设置 HttpOnly cookie
       |
7. 重定向回首页，用户已登录
```

### 权限模型

| 角色 | 能做什么 |
|------|----------|
| **访客**（未登录） | 浏览所有笔记 |
| **登录用户** | 浏览笔记 + 点赞/取消点赞 |
| **管理员** | 浏览笔记 + 点赞 + 创建笔记 + 删除笔记 |

管理员身份在 `lib/auth.ts` 中通过 GitHub 用户名判断。

---

## 数据流：一条笔记从创建到显示的完整路径

```
1. [管理员] 在 QuickCapture 文本框中输入内容，按 ⌘+Enter
       |
2. [home.tsx] 调用 fetch("/api/notes", { method: "POST", body: { content, reference } })
       |
3. [api/notes/route.ts] 验证管理员身份 → 调用 createNote()
       |
4. [lib/db.ts] INSERT INTO notes (content, reference) VALUES (?, ?)
       |
5. [home.tsx] 保存成功后，调用 refresh() → fetch("/api/notes")
       |
6. [api/notes/route.ts] 调用 getNotes()
       |
7. [lib/db.ts] SELECT * FROM notes + SELECT * FROM likes WHERE note_id IN (...)
       |
8. [home.tsx] setNotes(data.notes) → React 重新渲染列表
       |
9. [浏览器] 用户看到新笔记出现在列表顶部
```

---

## 前端设计细节

### 网格纸背景

页面背景模拟淡黄色网格纸效果：
- 底色 `#fdf8ee`（暖黄色）
- Canvas 绘制棕色细网格线（间距 28px，透明度 0.28）
- 网格交叉点有小圆点

### 鼠标 Ripple 交互

基于 Canvas 的实时动画（参考自 [zihuichen.com](https://zihuichen.com) 首页的点阵效果）：
- 鼠标靠近时，网格点被推开（弹簧物理模拟）
- 点的颜色从灰色渐变为橙色
- 附近的点之间出现橙色连接线
- 鼠标离开后，点弹回原位
- 适配 `devicePixelRatio` 保证 Retina 屏清晰

### 点赞交互

- 点击心形按钮 toggle 点赞状态
- 乐观更新：点击后立即更新 UI，不等服务端返回
- 弹跳动画（`likePop`，300ms）
- 点赞者的 GitHub 头像叠加排列显示

---

## 本地开发指南

### 前置条件

- Node.js 18+
- npm

### 首次设置

```bash
# 1. 安装依赖
npm install

# 2. 建立本地数据库
wrangler d1 execute zihui-notes-db --local --file=migrations/0001_init.sql
wrangler d1 execute zihui-notes-db --local --file=migrations/0003_simplify.sql
wrangler d1 execute zihui-notes-db --local --file=migrations/0004_likes.sql
```

### 启动开发服务器

> **注意**：本地开发时需要临时修改配置。

编辑 `vite.config.ts`，去掉 Cloudflare 插件：
```ts
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
});
```

编辑 `lib/env.ts`，使用本地数据库：
```ts
import type { D1Database } from "@cloudflare/workers-types";

interface AppEnv { DB: D1Database; GITHUB_CLIENT_ID: string; GITHUB_CLIENT_SECRET: string; }

export async function getEnv(): Promise<AppEnv> {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy<AppEnv>();
  return proxy.env;
}
```

然后启动：
```bash
npx vinext dev --port 3002
```

打开 http://localhost:3002 即可看到网站。

> **重要**：部署前记得把这两个文件改回生产版本。

---

## 部署到 Cloudflare

### 前置条件

1. Cloudflare 账号
2. 登录 wrangler：`wrangler login`

### 首次部署

```bash
# 1. 创建线上 D1 数据库（只需一次）
wrangler d1 create zihui-notes-db
# 记下返回的 database_id，填入 wrangler.jsonc

# 2. 在线上数据库执行迁移
wrangler d1 execute zihui-notes-db --remote --file=migrations/0001_init.sql
wrangler d1 execute zihui-notes-db --remote --file=migrations/0003_simplify.sql
wrangler d1 execute zihui-notes-db --remote --file=migrations/0004_likes.sql

# 3. 设置 GitHub OAuth Secret
npx wrangler secret put GITHUB_CLIENT_SECRET

# 4. 构建并部署
npx vinext build && npx wrangler deploy
```

### 后续更新

```bash
npx vinext build && npx wrangler deploy
```

### GitHub OAuth 设置

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers) 创建 OAuth App
2. Homepage URL: `https://notes.zihuichen.com`
3. Authorization callback URL: `https://notes.zihuichen.com/api/auth/callback`
4. 将 Client ID 填入 `wrangler.jsonc` 的 `GITHUB_CLIENT_ID`
5. 将 Client Secret 通过 `npx wrangler secret put GITHUB_CLIENT_SECRET` 设置

### 自定义域名

在 `wrangler.jsonc` 中配置 `routes`：
```jsonc
"routes": [
  { "pattern": "notes.zihuichen.com", "custom_domain": true }
]
```

部署后 Cloudflare 会自动创建 DNS 记录和 SSL 证书。同时设置 `"workers_dev": true` 以保留 `*.workers.dev` 域名作为备用。

---

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `npx vinext dev --port 3002` | 启动本地开发服务器 |
| `npx vinext build` | 构建生产版本 |
| `npx wrangler deploy` | 部署到 Cloudflare Workers |
| `wrangler d1 execute zihui-notes-db --local --file=<sql>` | 在本地数据库执行 SQL 文件 |
| `wrangler d1 execute zihui-notes-db --remote --file=<sql>` | 在线上数据库执行 SQL 文件 |
| `wrangler d1 execute zihui-notes-db --local --command "SQL"` | 在本地执行单条 SQL |
| `wrangler d1 execute zihui-notes-db --remote --command "SQL"` | 在线上执行单条 SQL |
| `npx wrangler secret put GITHUB_CLIENT_SECRET` | 设置 OAuth Secret |
| `wrangler tail` | 查看线上实时日志 |
| `wrangler login` | 登录 Cloudflare |

---

Product By Chen Zihui
