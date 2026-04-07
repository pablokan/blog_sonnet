<script lang="ts">
  import type { ActionData } from './$types';
  
  let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)]">
  <div class="w-full max-w-md bg-[var(--bg-card)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
    <h1 class="text-2xl font-bold font-['Playfair_Display'] mb-6 text-center">Login to Admin</h1>
    
    {#if form?.error}
      <p class="text-red-500 mb-4 text-center">{form.error}</p>
    {/if}

    <form method="POST" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-[var(--text-secondary)]">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          class="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" 
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          class="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" 
        />
      </div>

      <button 
        type="submit" 
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-[var(--radius-md)] shadow-sm text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors"
      >
        Sign In
      </button>
    </form>
  </div>
</div>
