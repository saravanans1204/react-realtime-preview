import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './RealtimePreview.css';
import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it';

// --- Type Definitions ---
type Mode = "scroll" | "Turn";

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
  mode?: Mode;

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

  /** Enable smooth scrolling animations. Defaults to true. */
  smoothScroll?: boolean;
}

// --- Debounce Constants ---
const FINALIZE_DEBOUNCE_MS = 500;
const SCROLL_DEBOUNCE_MS = 300;

// --- Component ---
export const RealtimePreview: React.FC<RealtimePreviewProps> = ({
  text,
  title = "previewer",
  mode = "scroll",
  containerClassName = '',
  pageClassName = '',
  onPageChange,
  smoothScroll = false,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFinalized, setIsFinalized] = useState(false);
  const [md, setMd] = useState<MarkdownIt | null>(null);
  const isButtonScrolling = useRef(false);
  const isManualScrolling = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize MarkdownIt with Shiki asynchronously, loading specific languages
  useEffect(() => {
    const initMd = async () => {
      const shikiPlugin = await Shiki({
        theme: 'github-light',
        langs: ['xml', 'css', 'javascript'],
      });
      const markdown = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).use(shikiPlugin);
      setMd(markdown);
    };
    initMd();
  }, []);

  const htmlContent = useMemo(() => {
    if (!md || !text) return '';
    return md.render(text);
  }, [md, text]);

  // Finalization
  useEffect(() => {
    setIsFinalized(false);

    const finalizeTimer = setTimeout(() => {
      setIsFinalized(true);

      if (mode === 'Turn' && contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(0);
      }
    }, FINALIZE_DEBOUNCE_MS);

    return () => clearTimeout(finalizeTimer);
  }, [htmlContent, mode]);

  // Auto-scroll during streaming
  useEffect(() => {
    const element = contentRef.current;
    if (element && !isFinalized && mode === 'scroll') {
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }
  }, [htmlContent, mode, isFinalized]);

  // Virtual scroll-to-page only on navigation
  useEffect(() => {
    if (mode === 'Turn' && isFinalized && contentRef.current && isButtonScrolling.current) {
      const pageHeight = contentRef.current.clientHeight;
      contentRef.current.scrollTo({
        top: currentPage * pageHeight,
        behavior: smoothScroll ? 'smooth' : 'auto'
      });

      const scrollTimer = setTimeout(() => {
        isButtonScrolling.current = false;
      }, 300);

      return () => clearTimeout(scrollTimer);
    }
  }, [currentPage, mode, isFinalized, smoothScroll]);

  // On-scroll page update
  useEffect(() => {
    const element = contentRef.current;
    if (mode !== 'Turn' || !isFinalized || !element) return;

    let debounceTimer: number;
    const handleScroll = () => {
      if (isButtonScrolling.current) return;

      isManualScrolling.current = true;

      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        const pageHeight = element.clientHeight;
        const scrollTop = element.scrollTop;
        const threshold = pageHeight * 0.2;
        const calculatedPage = Math.round((scrollTop + threshold) / pageHeight);

        if (calculatedPage !== currentPage) {
          setCurrentPage(calculatedPage);
        }
      }, SCROLL_DEBOUNCE_MS);
    };

    element.addEventListener('scroll', handleScroll);
    return () => {
      element.removeEventListener('scroll', handleScroll);
      clearTimeout(debounceTimer);
    };
  }, [mode, isFinalized, currentPage]);

  // Page calculation with ResizeObserver
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const viewableHeight = element.clientHeight;
      const totalContentHeight = element.scrollHeight;
      if (viewableHeight === 0) return;

      const calculatedPages = Math.ceil(totalContentHeight / viewableHeight);
      setTotalPages(calculatedPages || 1);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [htmlContent, mode]);

  // onPageChange callback
  useEffect(() => {
    if (onPageChange && mode === 'Turn') {
      onPageChange(currentPage, totalPages);
    }
  }, [currentPage, totalPages, onPageChange, mode]);

  // Navigation handlers
  const goToPrevPage = useCallback(() => {
    isButtonScrolling.current = true;
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    isButtonScrolling.current = true;
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    isButtonScrolling.current = true;
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    if (mode !== 'Turn') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); goToPrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); goToNextPage();
      } else if (e.key === 'Home') {
        e.preventDefault(); goToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault(); goToPage(totalPages - 1);
      }
    };
    const element = contentRef.current;
    element?.addEventListener('keydown', handleKeyDown);
    return () => element?.removeEventListener('keydown', handleKeyDown);
  }, [mode, goToPrevPage, goToNextPage, goToPage, totalPages]);

  // JSX Render
  return (
    <div
      className={`realtime-preview-container ${containerClassName} ${mode}`}
    >
      <div className="title-container">
        <h3 className="title">{title}</h3>
      </div>

      <div
        ref={contentRef}
        className="preview-content-area"
        role="article"
        aria-label="Document content"
        tabIndex={mode === 'Turn' ? 0 : -1}
      >
        <div
          className={`realtime-preview-page ${pageClassName}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {mode === 'Turn' && (
        <div className="pagination-controls" role="navigation" aria-label="Page navigation">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0 || !isFinalized}
            aria-label="Previous page"
            title="Previous page (← or ↑)"
          >
            ← Prev
          </button>
          <span className="page-indicator" aria-live="polite" aria-atomic="true">
            {isFinalized
              ? `Page ${currentPage + 1} of ${totalPages}`
              : 'Streaming...'
            }
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1 || !isFinalized}
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