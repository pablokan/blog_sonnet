<script lang="ts">
  import { LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-svelte';
  import { page } from '$app/state';
</script>

<nav class="w-64 h-screen bg-[var(--bg-card)] border-r border-[var(--border)] p-4 flex flex-col hidden md:flex sticky top-0">
  <div class="mb-8 font-['Playfair_Display'] text-2xl font-bold tracking-tight px-4">Admin</div>
  
  <div class="flex-1 space-y-2">
    <a href="/admin" class="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors {page.url.pathname === '/admin' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : ''}">
      <LayoutDashboard size={20} />
      <span>Dashboard</span>
    </a>
    
    <a href="/admin/posts" class="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors {page.url.pathname.startsWith('/admin/posts') && !page.url.pathname.includes('/new') ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : ''}">
      <FileText size={20} />
      <span>Posts</span>
    </a>
    
    <a href="/admin/posts/new" class="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors {page.url.pathname === '/admin/posts/new' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : ''}">
      <PlusCircle size={20} />
      <span>New Post</span>
    </a>
  </div>

  <form method="POST" action="/admin?/logout">
    <button class="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  </form>
</nav>
