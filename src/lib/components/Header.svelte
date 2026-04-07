<script lang="ts">
  import { Moon, Sun, Menu, X } from 'lucide-svelte';
  import { onMount } from 'svelte';
  
  let isDark = $state(false);
  let mobileMenuOpen = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }
</script>

<header class="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border)] transition-colors duration-200">
  <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="text-2xl font-bold font-['Playfair_Display'] text-[var(--text-primary)] hover:opacity-80 transition-opacity">
      Agent Blog
    </a>

    <nav class="hidden md:flex items-center gap-6 text-[var(--text-secondary)]">
      <a href="/" class="hover:text-[var(--text-primary)] transition-colors">Home</a>
      <a href="/admin" class="hover:text-[var(--text-primary)] transition-colors">Admin</a>
      
      <button onclick={toggleTheme} class="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors" aria-label="Toggle theme">
        {#if isDark}
          <Sun size={20} />
        {:else}
          <Moon size={20} />
        {/if}
      </button>
    </nav>
    
    <button onclick={() => mobileMenuOpen = !mobileMenuOpen} class="md:hidden p-2 text-[var(--text-primary)]" aria-label="Menu">
      {#if mobileMenuOpen}
        <X size={24} />
      {:else}
        <Menu size={24} />
      {/if}
    </button>
  </div>
  
  {#if mobileMenuOpen}
    <div class="md:hidden border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 py-4 space-y-4 shadow-lg absolute w-full transition-all duration-300">
      <a href="/" class="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2">Home</a>
      <a href="/admin" class="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2">Admin</a>
      <div class="pt-2 border-t border-[var(--border)] flex justify-between items-center">
        <span class="text-[var(--text-secondary)]">Theme</span>
        <button onclick={toggleTheme} class="p-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors">
          {#if isDark}
            <Sun size={20} />
          {:else}
            <Moon size={20} />
          {/if}
        </button>
      </div>
    </div>
  {/if}
</header>
