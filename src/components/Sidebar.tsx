import React, { useState, useRef } from 'react';
import styles from './Sidebar.module.css';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import ModeSelector from './ModeSelector';
import TextToNodesInput from './inputs/TextToNodesInput';
import TasklistToNodesInput from './inputs/TasklistToNodesInput';
import { PanelMode } from '../types/PanelMode';

// Common interface for all input components
interface InputComponentRef {
  convert: () => void;
}

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
  const [selectedMode, setSelectedMode] = useState<PanelMode>('text-to-nodes');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState('Copy all');
  const [error, setError] = useState<string | null>(null);

  const activeInputRef = useRef<InputComponentRef | null>(null);

  const handleConvert = () => {
    if (!excalidrawAPI) {
      setError('Editor not initialized. Please refresh the page.');
      return;
    }
    
    try {
      setError(null);
      activeInputRef.current?.convert();
    } catch (err) {
      console.error('Error converting:', err);
      setError('Failed to convert. Please check input format.');
    }
  };

  const handleConvertSuccess = () => {
    setError(null);
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

  const renderInputComponent = () => {
    const commonProps = {
      ref: activeInputRef,
      excalidrawAPI,
      onConvert: handleConvertSuccess
    };
    
    switch (selectedMode) {
      case 'text-to-nodes':
        return <TextToNodesInput {...commonProps} />;
      case 'tasklist-to-nodes':
        return <TasklistToNodesInput {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.appTitle}>* to excalidraw</h1>
      <ModeSelector 
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />
      <div className={styles.inputArea}>
        {renderInputComponent()}
      </div>
      <div className={styles.buttonArea}>
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
    </div>
  );
};

export default React.memo(Sidebar);
