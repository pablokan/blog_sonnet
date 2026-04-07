<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import { page } from '$app/state';

  let { children } = $props();
  
  // hide public header on admin routes
  let isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

{#if !isAdmin}
  <Header />
  <main class="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-500">
    {@render children()}
  </main>
{:else}
  {@render children()}
{/if}
