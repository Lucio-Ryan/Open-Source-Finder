interface RichTextContentProps {
  content: string;
  className?: string;
  /** Simple mode strips h1, h2, lists, blockquotes - only allows bold, italic, links, code */
  simple?: boolean;
}

/**
 * Strips complex HTML elements and keeps only simple formatting
 */
function stripComplexFormatting(html: string): string {
  // Create a temporary div to parse HTML
  if (typeof window === 'undefined') {
    // Server-side: use regex-based stripping
    return html
      // Convert h1-h6 to paragraphs
      .replace(/<h[1-6][^>]*>/gi, '<p>')
      .replace(/<\/h[1-6]>/gi, '</p>')
      // Convert list items to paragraphs with bullet/number prefix removed
      .replace(/<li[^>]*>/gi, '<p>')
      .replace(/<\/li>/gi, '</p>')
      // Remove ul/ol wrappers
      .replace(/<\/?[uo]l[^>]*>/gi, '')
      // Convert blockquotes to paragraphs
      .replace(/<blockquote[^>]*>/gi, '<p>')
      .replace(/<\/blockquote>/gi, '</p>')
      // Convert code blocks to inline code
      .replace(/<pre[^>]*><code[^>]*>/gi, '<code>')
      .replace(/<\/code><\/pre>/gi, '</code>')
      .replace(/<pre[^>]*>/gi, '')
      .replace(/<\/pre>/gi, '')
      // Remove hr
      .replace(/<hr[^>]*>/gi, '');
  }
  
  // Client-side: use DOM parsing for more accurate stripping
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Convert headings to paragraphs
  div.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
    const p = document.createElement('p');
    p.innerHTML = el.innerHTML;
    el.replaceWith(p);
  });
  
  // Convert list items to paragraphs
  div.querySelectorAll('li').forEach(el => {
    const p = document.createElement('p');
    p.innerHTML = el.innerHTML;
    el.replaceWith(p);
  });
  
  // Remove ul/ol wrappers
  div.querySelectorAll('ul, ol').forEach(el => {
    el.replaceWith(...Array.from(el.childNodes));
  });
  
  // Convert blockquotes to paragraphs
  div.querySelectorAll('blockquote').forEach(el => {
    const p = document.createElement('p');
    p.innerHTML = el.innerHTML;
    el.replaceWith(p);
  });
  
  // Convert code blocks to inline code
  div.querySelectorAll('pre').forEach(el => {
    const code = el.querySelector('code');
    if (code) {
      el.replaceWith(code);
    } else {
      const codeEl = document.createElement('code');
      codeEl.innerHTML = el.innerHTML;
      el.replaceWith(codeEl);
    }
  });
  
  // Remove hr
  div.querySelectorAll('hr').forEach(el => el.remove());
  
  return div.innerHTML;
}

export function RichTextContent({ content, className = '', simple = false }: RichTextContentProps) {
  const processedContent = simple ? stripComplexFormatting(content) : content;
  
  // Simple mode uses minimal prose styling
  const simpleClasses = `prose prose-invert prose-sm max-w-none
    prose-p:text-muted prose-p:leading-relaxed prose-p:mb-2 prose-p:last:mb-0
    prose-a:text-brand prose-a:no-underline hover:prose-a:underline
    prose-strong:text-white prose-strong:font-semibold
    prose-em:text-muted prose-em:italic
    prose-code:text-brand prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none`;
  
  const fullClasses = `prose prose-invert prose-sm max-w-none 
    prose-headings:text-white prose-headings:font-mono prose-headings:font-semibold
    prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4
    prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3
    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
    prose-p:text-muted prose-p:leading-relaxed prose-p:mb-4
    prose-a:text-brand prose-a:no-underline hover:prose-a:underline
    prose-strong:text-white prose-strong:font-semibold
    prose-em:text-muted prose-em:italic
    prose-ul:text-muted prose-ul:my-4
    prose-ol:text-muted prose-ol:my-4
    prose-li:my-1
    prose-blockquote:border-l-brand prose-blockquote:bg-surface/50 prose-blockquote:text-muted prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
    prose-code:text-brand prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
    prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-lg`;

  return (
    <div 
      className={`${simple ? simpleClasses : fullClasses} ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
