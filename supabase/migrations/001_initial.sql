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