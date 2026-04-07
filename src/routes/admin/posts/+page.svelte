<script lang="ts">
  import { PlusCircle, Edit, Trash2 } from 'lucide-svelte';
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  
  let { data, form }: { data: PageData, form: ActionData } = $props();
</script>

<div class="flex justify-between items-center mb-8">
  <h1 class="text-3xl font-bold font-['Playfair_Display'] text-[var(--text-primary)]">Manage Posts</h1>
  <a href="/admin/posts/new" class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors shadow-sm">
    <PlusCircle size={18} />
    New Post
  </a>
</div>

{#if form?.error}
  <div class="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-[var(--radius-md)] mb-6 border border-red-200 dark:border-red-900/50">
    {form.error}
  </div>
{/if}

<div class="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-hidden">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-b border-[var(--border)] text-sm uppercase tracking-wider">
        <th class="p-4 font-semibold">Title</th>
        <th class="p-4 font-semibold">Status</th>
        <th class="p-4 font-semibold">Date</th>
        <th class="p-4 font-semibold text-right">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[var(--border)]">
      {#each data.posts as post}
        <tr class="hover:bg-[var(--bg-secondary)]/50 transition-colors">
          <td class="p-4">
            <div class="font-medium text-[var(--text-primary)]">{post.title}</div>
            <div class="text-xs text-[var(--text-muted)] mt-1">{post.slug}</div>
          </td>
          <td class="p-4">
            {#if post.published}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Published
              </span>
            {:else}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                Draft
              </span>
            {/if}
          </td>
          <td class="p-4 text-sm text-[var(--text-secondary)]">
            {new Date(post.created_at).toLocaleDateString()}
          </td>
          <td class="p-4 flex justify-end gap-3">
            <a href={`/admin/posts/${post.id}`} class="text-blue-500 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
              <Edit size={18} />
            </a>
            <form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if(!confirm('Are you sure you want to delete this post?')) e.preventDefault(); }}>
              <input type="hidden" name="id" value={post.id} />
              <button class="text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                <Trash2 size={18} />
              </button>
            </form>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="4" class="p-8 text-center text-[var(--text-muted)]">
            No posts found. Start writing!
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
