import React, { useState, useCallback, useEffect } from 'react';
import {convertToExcalidrawElements, Excalidraw} from '@excalidraw/excalidraw';
import styles from './ExcalidrawWrapper.module.css';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { textToNodes } from '../utils/textToNodes';

/**
 * ExcalidrawWrapper component props
 * @property {string} inputText - Input text to convert
 * @property {Function} onExcalidrawAPIReady - Callback when Excalidraw API is ready
 */
interface ExcalidrawWrapperProps {
  inputText: string;
  onExcalidrawAPIReady: (api: ExcalidrawImperativeAPI) => void;
}

/**
 * Excalidraw wrapper component
 * Manages Excalidraw initialization and updates
 * @param {ExcalidrawWrapperProps} props - Component props
 * @returns Component with embedded Excalidraw
 */
const ExcalidrawWrapper = ({onExcalidrawAPIReady }: ExcalidrawWrapperProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize on first load
  useEffect(() => {
    if (excalidrawAPI) {
      try {
        setIsLoading(true);
        // Initialize empty scene
        const elements = textToNodes('');
        excalidrawAPI.updateScene({
          elements: convertToExcalidrawElements(elements),
        });
        setError(null);
      } catch (err) {
        console.error('Error initializing Excalidraw:', err);
        setError('Failed to initialize editor. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [excalidrawAPI]);

  // Set API and pass to parent component
  const handleExcalidrawAPI = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
    onExcalidrawAPIReady(api);
  }, [onExcalidrawAPIReady]);

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading && <div className={styles.loading}>Loading editor...</div>}
      <Excalidraw
        initialData={{
          appState: {
            viewBackgroundColor: '#FFFFFF',
            currentItemFontFamily: 1
          },
        }}
        excalidrawAPI={handleExcalidrawAPI}
      />
    </div>
  );
};

export default React.memo(ExcalidrawWrapper);
