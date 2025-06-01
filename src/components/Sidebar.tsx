import React, { ChangeEvent, useState } from 'react';
import styles from './Sidebar.module.css';
import { textToNodes } from '../utils/textToNodes';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import {convertToExcalidrawElements} from "@excalidraw/excalidraw";

/**
 * Sidebar component props
 * @property {ExcalidrawImperativeAPI | null} excalidrawAPI - API for Excalidraw interaction
 */
interface SidebarProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

/**
 * Sidebar component for text input and conversion to Excalidraw elements
 * @param {SidebarProps} props - Component props
 * @returns Sidebar with text area and convert button
 */

const Sidebar = ({ excalidrawAPI }: SidebarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!excalidrawAPI) {
      setError('Editor not initialized. Please refresh the page.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Convert text to nodes and update Excalidraw
      const elements = textToNodes(inputValue);
      
      excalidrawAPI.updateScene({
        elements: convertToExcalidrawElements(elements),
      });
      
      excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements(), {
        fitToContent: true,
      });
    } catch (err) {
      console.error('Error converting text:', err);
      setError('Failed to convert text. Please check input format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.appTitle}>* to excalidraw</h1>
      <h2 className={styles.title}>Input</h2>
      <p className={styles.description}>Each line will be converted to a separate node</p>
      {error && <div className={styles.error}>{error}</div>}
      <textarea 
        className={styles.textarea}
        onChange={handleChange}
        value={inputValue}
        placeholder="Enter text, each line will be a separate node"
        disabled={isProcessing}
      />
      <button 
        className={styles.button}
        onClick={handleConvert}
        disabled={isProcessing || !excalidrawAPI}
      >
        {isProcessing ? 'Processing...' : 'Convert'}
      </button>
    </div>
  );
};

export default React.memo(Sidebar);
