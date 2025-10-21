import React from 'react';
import './RealtimePreview.css';


type mode="scroll"| "Turn";



export interface RealtimePreviewProps {
  /**
   * The complete string of text to be rendered.
   * Update this prop as new text chunks arrive.
   */
  text: string;

  /**
   * This is to show a optional  title in top of the previewer 
   * @default: previewer
   */
  title?:string;


/**
 * This is for selecting which mode the previewer should be in 
 * @default scroll 
 * only two options "scroll"| "Turn";
 */
  mode?:mode;



  /**
   * The approximate number of characters to render per "page".
   * This is used to calculate page breaks.
   * @default 750
   */
  charsPerPage?: number; // Use '?' for optional props


  /**
   * Optional CSS class to apply to the main container.
   */
  containerClassName?: string;

  /**
   * Optional CSS class to apply to each individual page.
   */
  pageClassName?: string;


}


export const RealtimePreview: React.FC<RealtimePreviewProps> = ({
  text,
  title="previewer",
  mode="scroll",
  charsPerPage = 750, // Set defaults for optional props
  containerClassName = '',
  pageClassName = ''
}) => {

 
  const pages = React.useMemo(() => {
    const pageArray = [];
    for (let i = 0; i < text.length; i += charsPerPage) {
      pageArray.push(text.substring(i, i + charsPerPage));
    }
    return pageArray;
  }, [text, charsPerPage]); // Only recalculate when text or charsPerPage changes

  
  return (
    <div className={`realtime-preview-container ${containerClassName} ${mode}`}>
        <div className={`title-container`}>
             <h3 className='title'>{title}</h3>
        </div>
       
      {pages.map((pageContent, index) => (
        <div key={index} className={`realtime-preview-page ${pageClassName}`}>
          {pageContent}
        </div>
      ))}
    </div>
  );
};