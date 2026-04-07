<script lang="ts">
  import type { Post } from '$lib/types';
  import { CalendarDays } from 'lucide-svelte';
  
  let { post }: { post: Post } = $props();
  
  let date = $derived(new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
</script>

<article class="group relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1">
  <a href={`/posts/${post.slug}`} class="block aspect-video w-full overflow-hidden bg-[var(--bg-secondary)] relative">
    {#if post.cover_url}
      <img 
        src={post.cover_url} 
        alt={post.title} 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <span class="text-4xl opacity-20 font-['Playfair_Display']">{post.title.charAt(0)}</span>
      </div>
    {/if}
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </a>

  <div class="p-6">
    <div class="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
      <CalendarDays size={16} />
      <time datetime={post.created_at}>{date}</time>
    </div>
    
    <h2 class="text-2xl font-bold font-['Playfair_Display'] text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
      <a href={`/posts/${post.slug}`} class="focus:outline-none">
        <span class="absolute inset-0" aria-hidden="true"></span>
        {post.title}
      </a>
    </h2>
    
    {#if post.excerpt}
      <p class="text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
        {post.excerpt}
      </p>
    {/if}
  </div>
</article>
