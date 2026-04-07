# Agent Blog PoC

Este proyecto es una Prueba de Concepto (PoC) de un blog completo generado y gestionado mediante agentes de Inteligencia Artificial. Sirve como demostración de la capacidad de herramientas agénticas modernas para construir aplicaciones full-stack de alta calidad, desde la base de datos hasta la interfaz de usuario.

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto utiliza un stack moderno, tipo "Serverless", diseñado para ser rápido, económico de mantener y fácil de escalar.

### 1. Frontend & Meta-framework: SvelteKit 5
- **Framework:** SvelteKit 5 utilizando el nuevo sistema de reactividad basado en *Runes* (`$state`, `$derived`, `$effect`).
- **Renderizado:** Server-Side Rendering (SSR) combinado con hidratación en el cliente, lo que garantiza un SEO óptimo y tiempos de carga rápidos.
- **Estilos:** Tailwind CSS v4, integrado nativamente a través de Vite (sin directivas `@tailwind` legacy, utilizando la nueva sintaxis `@import "tailwindcss"`).
- **Procesamiento de Markdown:** Utiliza `marked` y `highlight.js` para renderizar el contenido de los posts con resaltado de sintaxis nativo para bloques de código.

### 2. Base de Datos & Backend as a Service: Supabase
- **Base de Datos:** PostgreSQL alojado en Supabase.
- **Esquema Único:** Tabla `posts` que almacena el contenido (título, markdown, fecha, estado de publicación).
- **Seguridad (RLS - Row Level Security):** 
  - La base de datos tiene políticas restrictivas a nivel de fila.
  - Los usuarios públicos solo pueden leer (SELECT) posts donde `published = true`.
  - El administrador (backend de SvelteKit) utiliza la `SERVICE_ROLE_KEY` para saltarse estas políticas y poder realizar operaciones CRUD completas de forma segura.

### 3. Autenticación (Sistema Monousuario)
La arquitectura implementa un sistema de autenticación personalizado monousuario, diseñado específicamente para blogs personales, evitando la complejidad innecesaria de sistemas como Supabase Auth:
- **Credenciales Estáticas:** Administrador definido en variables de entorno de servidor (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
- **Manejo de Sesión:** Implementado a través de Server Actions de SvelteKit. Tras un login exitoso, se establece una cookie segura (`HttpOnly`, `Secure`, `SameSite=Strict`).
- **Protección de Rutas:** El archivo `src/routes/admin/+layout.server.ts` actúa como un "Guard" o middleware, validando la cookie antes de renderizar cualquier vista del panel de administración.
- **Contexto Global:** `src/hooks.server.ts` inyecta la sesión en `event.locals` para que esté disponible en cualquier parte del ciclo de vida del servidor.

### 4. Hosting & Deployment: Vercel
- **Infraestructura:** Desplegado en Vercel utilizando `@sveltejs/adapter-vercel`.
- **Runtime:** Node.js 20.x configurado desde `svelte.config.js`.
- **Variables de Entorno:** Integración continua a través de GitHub, inyectando de forma segura las variables críticas (claves de Supabase y credenciales de Admin) en tiempo de ejecución.

## 📂 Estructura Principal

```text
/
├── src/
│   ├── hooks.server.ts       # Middleware de autenticación global
│   ├── lib/
│   │   ├── components/       # UI Reutilizable (Header, PostCard, etc.)
│   │   ├── supabase.server.ts# Cliente Supabase SSR (con y sin privilegios)
│   │   └── types.ts          # Definiciones TypeScript de BD
│   └── routes/
│       ├── +page.svelte      # Landing page pública
│       ├── posts/[slug]/     # Renderizado de post individual
│       └── admin/            # Panel privado (Layout Guard, CRUD)
├── supabase/
│   └── migrations/           # Definición de la BD y RLS policies
└── tailwind.config.ts / app.css # Sistema de diseño (Dark Mode first)
```

## 🚀 Configuración Local

1. Instalar dependencias: `pnpm install`
2. Configurar variables: Renombrar `.env.example` a `.env.local` y añadir:
   - URLs y Keys de Supabase (Anon y Service Role).
   - Credenciales deseadas para el admin.
3. Base de datos: Ejecutar el contenido de `supabase/migrations/001_initial.sql` en el SQL Editor de tu proyecto en Supabase.
4. Levantar servidor: `pnpm dev`
5. Acceder a `http://localhost:5173/admin` para gestionar el contenido.
