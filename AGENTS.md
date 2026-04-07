# AGENTS.md — AI Blog PoC
# Stack: SvelteKit 5 + Tailwind CSS v4 + Supabase + Vercel
# Herramienta: opencode (GLM-5 / Kimi K2.5 / MiniMax M2.5 / Gemini 2.5 Pro)

## Contexto del proyecto

Este proyecto es un blog generado por agentes de IA como prueba de concepto comparativa
de herramientas agénticas. El blog tiene:
- UI de alta calidad visual (dark mode, animaciones sutiles, tipografía cuidada)
- Persistencia completa en Supabase (PostgreSQL)
- Autenticación monousuario (solo admin, sin registro público)
- Deploy en Vercel (Edge-compatible, sin backend separado)
- Todo el contenido del blog es generado/gestionado por IA

## Stack tecnológico OBLIGATORIO

```
Frontend:  SvelteKit 5 (con runes: $state, $derived, $effect)
Estilos:   Tailwind CSS v4 (NO usar v3 — la sintaxis cambió)
DB + Auth: Supabase (supabase-js v2)
Deploy:    Vercel (adaptador @sveltejs/adapter-vercel)
Package:   pnpm (NO npm, NO yarn)
Runtime:   Node 20+
```

## Estructura de archivos a generar

```
/
├── AGENTS.md                        ← este archivo
├── .env.local                       ← variables de entorno (nunca commitear)
├── .env.example                     ← plantilla de variables (sí commitear)
├── .gitignore
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.ts               ← solo si se necesita extender
├── app.html
├── src/
│   ├── app.css                      ← estilos globales + variables CSS
│   ├── app.d.ts                     ← types globales (locals.user, etc.)
│   ├── hooks.server.ts              ← Supabase SSR session handling
│   ├── lib/
│   │   ├── supabase.ts              ← cliente Supabase (browser)
│   │   ├── supabase.server.ts       ← cliente Supabase (server, con cookies)
│   │   ├── types.ts                 ← tipos TypeScript del dominio
│   │   └── components/
│   │       ├── Header.svelte
│   │       ├── PostCard.svelte
│   │       ├── PostContent.svelte   ← renderiza markdown
│   │       └── AdminNav.svelte
│   └── routes/
│       ├── +layout.svelte           ← layout raíz con dark mode toggle
│       ├── +layout.server.ts        ← getSession en cada ruta
│       ├── +page.svelte             ← home: lista de posts
│       ├── +page.server.ts
│       ├── posts/
│       │   └── [slug]/
│       │       ├── +page.svelte     ← post individual
│       │       └── +page.server.ts
│       └── admin/
│           ├── +layout.svelte       ← layout admin con sidebar
│           ├── +layout.server.ts    ← guard: redirige si no auth
│           ├── +page.svelte         ← dashboard admin
│           ├── login/
│           │   ├── +page.svelte
│           │   └── +page.server.ts  ← acción de login
│           └── posts/
│               ├── +page.svelte     ← lista de posts (CRUD)
│               ├── new/
│               │   ├── +page.svelte
│               │   └── +page.server.ts
│               └── [id]/
│                   ├── +page.svelte ← editar post
│                   └── +page.server.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql          ← schema + RLS policies
└── vercel.json
```

## Base de datos Supabase

### Schema SQL (archivo: supabase/migrations/001_initial.sql)

CRÍTICO: Generar este archivo PRIMERO antes de cualquier código de aplicación.

```sql
-- Tabla de posts
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text,
  content     text not null,         -- markdown
  cover_url   text,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Índices
create index posts_slug_idx on posts(slug);
create index posts_published_idx on posts(published, created_at desc);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- RLS: habilitar siempre
alter table posts enable row level security;

-- Política pública: leer posts publicados sin auth
create policy "public_read_published"
  on posts for select
  using (published = true);

-- Política admin: acceso total con service role
-- (Las operaciones admin usan supabaseAdmin con service_role key, no RLS)
```

### Variables de entorno requeridas (.env.example)

```bash
# Supabase — obtener en: supabase.com > proyecto > Settings > API
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # solo server-side, NUNCA exponer al cliente

# Admin credentials — usuario único hardcodeado
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=cambiar_esto_en_produccion

# Vercel — se autodetecta en deploy, solo necesario local
VERCEL_URL=http://localhost:5173
```

## Autenticación (monousuario)

La autenticación es simple: un único admin hardcodeado en variables de entorno.
NO implementar registro de usuarios. NO usar Supabase Auth users table.

### Estrategia recomendada: session con cookie HttpOnly

```typescript
// src/routes/admin/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return fail(401, { error: 'Credenciales incorrectas' });
    }

    // Token simple: en producción usar JWT firmado
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7  // 7 días
    });

    redirect(303, '/admin');
  }
};
```

### Guard en layout admin

```typescript
// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies }) => {
  const session = cookies.get('admin_session');
  if (session !== 'authenticated') {
    redirect(303, '/admin/login');
  }
  return { authenticated: true };
};
```

## Diseño UI — Especificaciones OBLIGATORIAS

El agente DEBE generar una UI visualmente cuidada. NO usar estilos genéricos/básicos.

### Sistema de colores (app.css)

```css
/* Definir en :root y .dark */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f7f4;
  --bg-card: #ffffff;
  --text-primary: #1a1917;
  --text-secondary: #6b6a66;
  --text-muted: #9c9b97;
  --accent: #2563eb;          /* azul principal */
  --accent-hover: #1d4ed8;
  --border: rgba(0,0,0,0.08);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}

.dark {
  --bg-primary: #111110;
  --bg-secondary: #1a1917;
  --bg-card: #1f1f1d;
  --text-primary: #e8e6e1;
  --text-secondary: #9c9b97;
  --text-muted: #6b6a66;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --border: rgba(255,255,255,0.08);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
}
```

### Componentes requeridos con calidad visual

**Header** (src/lib/components/Header.svelte):
- Logo/nombre del blog en fuente serif o display
- Navegación minimalista
- Toggle dark/light mode con animación suave
- Sticky con backdrop-blur en scroll

**PostCard** (src/lib/components/PostCard.svelte):
- Imagen de cover (lazy loading con placeholder)
- Título, excerpt, fecha formateada
- Hover: sutil elevación con sombra y transición 200ms
- Tag/categoría si existe

**PostContent** (src/lib/components/PostContent.svelte):
- Renderizado de markdown con marked o marked-highlight
- Tipografía de lectura: line-height 1.8, max-width 680px
- Código con syntax highlighting (highlight.js o shiki)
- Imágenes responsivas

**AdminNav**: sidebar colapsable en mobile, íconos de Lucide Svelte

### Tipografía

```html
<!-- app.html: cargar fuentes desde Google Fonts o Fontsource -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

- Cuerpo: Inter, 16px, regular/medium
- Títulos del blog: Playfair Display o similar serif
- Código: JetBrains Mono o system monospace

## Comandos de desarrollo

```bash
# Setup inicial (ejecutar en orden)
pnpm create svelte@latest . --template skeleton --types typescript
pnpm install
pnpm add @supabase/supabase-js @sveltejs/adapter-vercel
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add marked highlight.js lucide-svelte

# Desarrollo local
pnpm dev

# Build (verificar antes de push)
pnpm build
pnpm preview

# Type check (ejecutar antes de considerar una tarea terminada)
pnpm check

# Deploy (automático via Vercel GitHub integration)
# Manual: vercel --prod
```

## Configuraciones críticas

### svelte.config.js

```javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};
```

### vercel.json

```json
{
  "framework": "sveltekit",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".vercel/output"
}
```

### Tailwind v4 en vite.config.ts

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

```css
/* src/app.css — Tailwind v4: import, no @tailwind directives */
@import "tailwindcss";
```

## Cliente Supabase (patrón SSR correcto)

```typescript
// src/lib/supabase.server.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

// Cliente para operaciones de usuario (respeta RLS)
export function createSupabaseServerClient(cookies: Cookies) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, { ...options, path: '/' })
        );
      }
    }
  });
}

// Cliente admin (service role, bypasea RLS) — SOLO para operaciones admin
export function createSupabaseAdminClient() {
  return createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
    auth: { persistSession: false }
  });
}
```

## Convenciones de código

### TypeScript estricto
- Siempre tipar los `load` functions con `PageServerLoad`, `LayoutServerLoad`
- Tipar las `actions` con `Actions`
- NO usar `any` — usar `unknown` y narrowing
- Definir todos los tipos del dominio en `src/lib/types.ts`

### SvelteKit 5 — usar Runes
```svelte
<!-- CORRECTO: Svelte 5 -->
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => { console.log(count); });
</script>

<!-- INCORRECTO: NO usar sintaxis Svelte 4 -->
<script>
  let count = 0;  ← incorrecto en Svelte 5
  $: doubled = count * 2;  ← incorrecto en Svelte 5
</script>
```

### Manejo de errores en server actions
```typescript
// Siempre usar fail() para errores manejados
import { fail } from '@sveltejs/kit';

export const actions = {
  create: async ({ request, cookies }) => {
    // ... validación
    if (!title) return fail(400, { error: 'El título es requerido', title });
    // ... operación
    return { success: true };
  }
};
```

### Slugs de posts
```typescript
// src/lib/utils.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
```

## Orden de implementación OBLIGATORIO

El agente DEBE seguir este orden para evitar dependencias rotas:

1. **Schema SQL** → generar `supabase/migrations/001_initial.sql` completo con RLS
2. **Configuración base** → package.json, svelte.config.js, vite.config.ts, app.css, app.html
3. **Variables de entorno** → .env.example, .gitignore (incluir .env.local)
4. **Tipos** → src/lib/types.ts, src/app.d.ts
5. **Clientes Supabase** → src/lib/supabase.ts, src/lib/supabase.server.ts
6. **Auth** → admin/login route + layout guard
7. **Rutas públicas** → home (lista posts) + post individual
8. **Admin CRUD** → dashboard + crear/editar/eliminar posts
9. **Componentes UI** → Header, PostCard, PostContent, AdminNav
10. **Verificación** → ejecutar `pnpm check` y `pnpm build`

## Verificación antes de terminar

El agente DEBE ejecutar estos comandos y resolver los errores antes de declarar la tarea completa:

```bash
pnpm check          # type errors de Svelte + TS
pnpm build          # build completo para Vercel
# Si hay errores: leer el mensaje completo, corregir, repetir
```

## Notas sobre modelos (contexto para el agente)

Este AGENTS.md está optimizado para contexto largo. Si el modelo tiene límite de contexto:
- Leer solo las secciones relevantes para la tarea actual
- Priorizar: "Orden de implementación" > "Convenciones" > ejemplos de código
- El esquema SQL en "Base de datos Supabase" es CRÍTICO — nunca omitirlo

Para GLM-5 y Kimi K2.5: el tool calling funciona bien, pueden leer archivos en paralelo.
Para MiniMax M2.5: preferir tareas atómicas, un archivo a la vez si hay problemas de coherencia.
Para Gemini 2.5 Pro (API free): respetar el límite de 5 RPM — el agente debe esperar entre llamadas.
