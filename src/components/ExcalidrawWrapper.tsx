import { useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawElementType } from '../types';
import styles from './ExcalidrawWrapper.module.css';

interface ExcalidrawWrapperProps {
  inputText: string;
}

const ExcalidrawWrapper = ({ inputText }: ExcalidrawWrapperProps) => {
  const [elements, setElements] = useState<ExcalidrawElementType[]>([]);

  useEffect(() => {
    if (inputText) {
      const lines = inputText.split('\n').filter(line => line.trim() !== '');
      
      const newElements = lines.map((line, index) => ({
        id: `node-${index}`,
        type: 'text',
        x: 100,
        y: 100 + index * 100,
        width: 200,
        height: 50,
        text: line,
        fontSize: 20,
        fontFamily: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        containerId: null,
        isDeleted: false,
      } as ExcalidrawElementType));
      
      setElements(newElements);
    } else {
      setElements([]);
    }
  }, [inputText]);

  return (
    <div className={styles.container}>
      <Excalidraw
        initialData={{
          elements,
          appState: { viewBackgroundColor: '#FFFFFF' },
        }}
      />
    </div>
  );
};

export default ExcalidrawWrapper;
