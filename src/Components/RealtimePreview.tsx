import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import './RealtimePreview.css';

// --- Type Definitions ---
type mode = "scroll" | "Turn";

export interface RealtimePreviewProps {
  /**
   * The complete string of text to be rendered.
   * Update this prop as new text chunks arrive.
   */
  text: string;

  /**
   * An optional title to display at the top of the previewer.
   * @default "previewer"
   */
  title?: string;

  /**
   * Selects the viewing mode for the document.
   * - `scroll`: (Default) All pages are in one continuous scrolling container.
   * - `Turn`: Pages are viewed one at a time with controls.
   * @default "scroll"
   */
  mode?: mode;

  /**
   * Optional CSS class to apply to the main container.
   */
  containerClassName?: string;

  /**
   * Optional CSS class to apply to the text content block.
   */
  pageClassName?: string;

/** Callback fired when page changes in turn mode */
  onPageChange?: (page: number, totalPages: number) => void;
  
  /** Enable smooth scrolling animations */
  smoothScroll?: boolean;
}



const parseMarkdown = (text: string): string => {
  if (!text) return '';
  
  let html = text;
  
  // Escape existing HTML to prevent injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Headers (must be at start of line)
  html = html.replace(/^######\s+(.*)$/gim, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gim, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gim, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gim, '<h1>$1</h1>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  html = html.replace(/^\*\*\*$/gim, '<hr>');
  
  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, '<blockquote>$1</blockquote>');
  
  // Bold (must come before italic to avoid conflicts)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Process lists more carefully
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Unordered list items
    if (/^[-*+]\s+/.test(trimmedLine)) {
      if (!inUnorderedList) {
        processedLines.push('<ul>');
        inUnorderedList = true;
      }
      const content = trimmedLine.replace(/^[-*+]\s+/, '');
      processedLines.push(`<li>${content}</li>`);
    } 
    // Ordered list items
    else if (/^\d+\.\s+/.test(trimmedLine)) {
      if (!inOrderedList) {
        processedLines.push('<ol>');
        inOrderedList = true;
      }
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      processedLines.push(`<li>${content}</li>`);
    } 
    // Close lists if not a list item
    else {
      if (inUnorderedList) {
        processedLines.push('</ul>');
        inUnorderedList = false;
      }
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      processedLines.push(line);
    }
  }
  
  // Close any remaining open lists
  if (inUnorderedList) processedLines.push('</ul>');
  if (inOrderedList) processedLines.push('</ol>');
  
  html = processedLines.join('\n');
  
  // Paragraphs (double line breaks)
  html = html.replace(/\n\n+/g, '</p><p>');
  
  // Single line breaks
  html = html.replace(/\n/g, '<br/>');
  
  // Wrap content in paragraph tags if needed
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*<br\/>\s*<\/p>/g, '');
  
  return html;
};


export const RealtimePreview: React.FC<RealtimePreviewProps> = ({
  text,
  title = "previewer",
  mode = "scroll",
  containerClassName = '',
  pageClassName = '',
  onPageChange,
}) => {

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);

  const contentRef = useRef<HTMLDivElement>(null);


  const previousTextLengthRef = useRef(0);

  // Memoize parsed HTML to avoid unnecessary re-parsing
  const htmlContent = useMemo(() => parseMarkdown(text), [text]);

  // --- The "Heavy Work" ---
  // Recalculates total pages whenever the text or container size changes.
  useEffect(() => {
    const element = contentRef.current;
  
    if (!element) return;

    // The ResizeObserver watches for size changes
    const observer = new ResizeObserver(() => {
      const viewableHeight = element.clientHeight;
      
      
      // Get the total height of all content
      const totalContentHeight = element.scrollHeight;
    


      if (viewableHeight === 0) return;

      const calculatedPages = Math.ceil(totalContentHeight / viewableHeight);
      console.log(calculatedPages);
      setTotalPages(calculatedPages || 1);

      // if(calculatedPages===1){
      //   setPages((prev)=>prev)
      // }


      
      if (mode === 'Turn') {
        setCurrentPage(calculatedPages - 1);
      }
  
    });

    observer.observe(element);

    // Clean up
    return () => observer.disconnect();

  }, [text, mode]); 

   useEffect(() => {
    if (onPageChange && mode === 'Turn') {
      onPageChange(currentPage, totalPages);
    }
  }, [currentPage, totalPages, onPageChange, mode]);

  // --- Page Turning Scroll Effect ---
  // This scrolls the page when currentPage changes in "Turn" mode
  useEffect(() => {
    if (mode === 'Turn' && contentRef.current) {
      const pageHeight = contentRef.current.clientHeight;
      contentRef.current.scrollTo({
        top: currentPage * pageHeight,
        // behavior: 'smooth' // Smooth scroll!
      });
    }
  }, [currentPage, mode]);



// Navigation handlers
  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
  }, [totalPages]);


  // Keyboard navigation
  useEffect(() => {
    if (mode !== 'Turn') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPage(totalPages - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, goToPrevPage, goToNextPage, goToPage, totalPages]);

  // --- Render ---
  return (
    <div className={`realtime-preview-container ${containerClassName} ${mode}`}>
      
      {/* 1. Title Bar */}
      <div className={`title-container`}>
        <h3 className='title'>{title}</h3>
      </div>

      {/* 2. Content Area (The part that scrolls) */}
        <div 
        ref={contentRef}
        className="preview-content-area"
        style={{ overflowY: mode === 'Turn' ? 'hidden' : 'auto' }}
        role="article"
        aria-label="Document content"
      >
        <div 
          className={`realtime-preview-page ${pageClassName}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      
      {/* 3. Pagination Controls (Only in "Turn" mode) */}
      {mode === 'Turn' && (
        <div className="pagination-controls" role="navigation" aria-label="Page navigation">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 0}
            aria-label="Previous page"
            title="Previous page (← or ↑)"
          >
            ← Prev
          </button>
          <span aria-live="polite" aria-atomic="true">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
            title="Next page (→ or ↓)"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};