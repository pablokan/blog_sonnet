<script lang="ts">
  import PostContent from '$lib/components/PostContent.svelte';
  import { CalendarDays, ArrowLeft } from 'lucide-svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  
  let date = $derived(new Date(data.post.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
</script>

<svelte:head>
  <title>{data.post.title}</title>
  {#if data.post.excerpt}
    <meta name="description" content={data.post.excerpt} />
  {/if}
</svelte:head>

<article class="max-w-3xl mx-auto">
  <div class="mb-12">
    <a href="/" class="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8 font-medium group">
      <ArrowLeft size={16} class="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver
    </a>
    
    <div class="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4 font-medium tracking-wide">
      <CalendarDays size={18} />
      <time datetime={data.post.created_at}>{date}</time>
    </div>
    
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Playfair_Display'] text-[var(--text-primary)] tracking-tight leading-tight mb-6">
      {data.post.title}
    </h1>
    
    {#if data.post.excerpt}
      <p class="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed font-light mb-8">
        {data.post.excerpt}
      </p>
    {/if}
  </div>

  {#if data.post.cover_url}
    <div class="mb-16 rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      <img src={data.post.cover_url} alt={data.post.title} class="w-full h-auto object-cover max-h-[500px]" />
    </div>
  {/if}

  <div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-6 md:p-12">
    <PostContent content={data.post.content} />
  </div>
</article>
