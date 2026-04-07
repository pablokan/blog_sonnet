<script lang="ts">
  import AdminNav from '$lib/components/AdminNav.svelte';
  import { page } from '$app/state';

  let { children } = $props();
  
  // hide nav on login page
  let isLogin = $derived(page.url.pathname === '/admin/login');
</script>

<div class="flex min-h-screen bg-[var(--bg-secondary)]">
  {#if !isLogin}
    <AdminNav />
  {/if}
  <main class="flex-1 p-8 md:p-12 overflow-auto max-w-6xl mx-auto">
    {@render children()}
  </main>
</div>
