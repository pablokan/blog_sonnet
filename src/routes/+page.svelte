<script lang="ts">
  import PostCard from '$lib/components/PostCard.svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<div class="mb-16 md:mb-24 text-center">
  <h1 class="text-4xl md:text-6xl font-extrabold font-['Playfair_Display'] text-[var(--text-primary)] tracking-tight mb-4">
    Pensamientos y Bits.
  </h1>
  <p class="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
    Explorando el desarrollo conducido por IA, arquitectura de software y más.
  </p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
  {#each data.posts as post (post.id)}
    <PostCard {post} />
  {:else}
    <div class="col-span-full py-20 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
      <p class="text-lg">No hay posts publicados todavía.</p>
    </div>
  {/each}
</div>
