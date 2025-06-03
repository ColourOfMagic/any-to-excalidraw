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
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState('Copy all');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!excalidrawAPI) {
      setError('Editor not initialized. Please refresh the page.');
      return;
    }
    
    try {
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
    }
  };

  const handleCopyAll = async () => {
    if (!excalidrawAPI || isAnimating) {
      if (!excalidrawAPI) {
        setError('Editor not initialized. Please refresh the page.');
      }
      return;
    }
    
    try {
      setError(null);
      
      // Get all elements from the scene
      const elements = excalidrawAPI.getSceneElements();
      
      if (elements.length === 0) {
        setError('No elements to copy');
        return;
      }
      
      // Create Excalidraw clipboard format
      const clipboardData = {
        type: "excalidraw/clipboard",
        elements: elements,
        files: null
      };
      
      // Copy to clipboard as JSON
      await navigator.clipboard.writeText(JSON.stringify(clipboardData));
      
      // Start animation
      setIsAnimating(true);
      setDisplayText('Copied!');
      
      // Reset to original text after delay
      setTimeout(() => {
        setDisplayText('Copy all');
        setIsAnimating(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error copying elements:', err);
      setError('Failed to copy elements to clipboard');
      setIsAnimating(false);
      setDisplayText('Copy all');
    }
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.appTitle}>* to excalidraw</h1>
      <h2 className={styles.title}>Input</h2>
      <p className={styles.description}>Each line will be converted to a separate node</p>
      <textarea 
        className={styles.textarea}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
        placeholder="Enter text, each line will be a separate node"
      />
      <button 
        className={styles.button}
        onClick={handleConvert}
        disabled={!excalidrawAPI}
      >
        Convert (shift+enter)
      </button>
      <button 
        className={`${styles.button} ${styles.copyButton} ${isAnimating ? styles.animating : ''}`}
        onClick={handleCopyAll}
        disabled={!excalidrawAPI || isAnimating}
      >
        {displayText}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default React.memo(Sidebar);
