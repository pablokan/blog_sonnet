<script lang="ts">
  import { Marked } from 'marked';
  import { markedHighlight } from 'marked-highlight';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';

  let { content }: { content: string } = $props();

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );

  let htmlContent = $derived(marked.parse(content) as string);
</script>

<div class="prose prose-lg dark:prose-invert prose-headings:font-['Playfair_Display'] prose-headings:font-bold prose-a:text-[var(--accent)] hover:prose-a:text-[var(--accent-hover)] prose-p:leading-relaxed prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto max-w-[680px] mx-auto text-[var(--text-primary)]">
  {@html htmlContent}
</div>
