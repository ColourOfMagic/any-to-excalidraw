import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ExcalidrawWrapper from './ExcalidrawWrapper';
import styles from './Layout.module.css';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

/**
 * Main application layout component
 * Manages ExcalidrawAPI state and passes it to child components
 * @returns Layout component with sidebar and Excalidraw canvas
 */
const Layout = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const handleExcalidrawAPIReady = (api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
  };

  return (
    <div className={styles.container}>
      <Sidebar excalidrawAPI={excalidrawAPI} />
      <ExcalidrawWrapper 
        inputText="" 
        onExcalidrawAPIReady={handleExcalidrawAPIReady} 
      />
    </div>
  );
};

export default React.memo(Layout);
