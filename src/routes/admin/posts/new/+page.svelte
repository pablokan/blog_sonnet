<script lang="ts">
  import { ArrowLeft, Save } from 'lucide-svelte';
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  let { form }: { form: ActionData } = $props();
</script>

<div class="mb-8 flex items-center justify-between">
  <div>
    <a href="/admin/posts" class="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-4 font-medium group">
      <ArrowLeft size={16} class="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver a Posts
    </a>
    <h1 class="text-3xl font-bold font-['Playfair_Display'] text-[var(--text-primary)]">Nuevo Post</h1>
  </div>
</div>

{#if form?.error}
  <div class="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-[var(--radius-md)] mb-6 border border-red-200 dark:border-red-900/50">
    {form.error}
  </div>
{/if}

<form method="POST" action="?/create" use:enhance class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-6 md:p-8 space-y-6">
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="space-y-2">
      <label for="title" class="block text-sm font-medium text-[var(--text-secondary)]">Título <span class="text-red-500">*</span></label>
      <input type="text" id="title" name="title" required value={form?.title ?? ''}
        class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors" />
    </div>
    
    <div class="space-y-2">
      <label for="slug" class="block text-sm font-medium text-[var(--text-secondary)]">Slug (opcional, autogenerado si está vacío)</label>
      <input type="text" id="slug" name="slug" value={form?.slug ?? ''}
        class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors" />
    </div>
  </div>

  <div class="space-y-2">
    <label for="excerpt" class="block text-sm font-medium text-[var(--text-secondary)]">Resumen (Excerpt)</label>
    <textarea id="excerpt" name="excerpt" rows="2"
      class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-y">{form?.excerpt ?? ''}</textarea>
  </div>

  <div class="space-y-2">
    <label for="cover_url" class="block text-sm font-medium text-[var(--text-secondary)]">URL de la Imagen de Portada</label>
    <input type="url" id="cover_url" name="cover_url" value={form?.cover_url ?? ''}
      class="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors" />
  </div>

  <div class="space-y-2">
    <label for="content" class="block text-sm font-medium text-[var(--text-secondary)]">Contenido (Markdown) <span class="text-red-500">*</span></label>
    <textarea id="content" name="content" rows="12" required
      class="w-full font-mono text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-y">{form?.content ?? ''}</textarea>
  </div>

  <div class="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
    <input type="checkbox" id="published" name="published" value="true"
      class="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]" />
    <label for="published" class="text-sm font-medium text-[var(--text-primary)]">Publicar inmediatamente</label>
  </div>

  <div class="pt-6 flex justify-end">
    <button type="submit" class="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
      <Save size={18} />
      Guardar Post
    </button>
  </div>
</form>
