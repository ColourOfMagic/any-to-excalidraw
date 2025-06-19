import React, { ChangeEvent, useState, useImperativeHandle, forwardRef } from 'react';
import styles from './InputComponents.module.css';
import { textToNodes } from '../../utils/textToNodes';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

interface TextToNodesInputProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onConvert: () => void;
}

export interface TextToNodesInputRef {
  convert: () => void;
}

const TextToNodesInput = forwardRef<TextToNodesInputRef, TextToNodesInputProps>(
  ({ excalidrawAPI, onConvert }, ref) => {
    const [value, setValue] = useState('');
    const [wrapInRectangles, setWrapInRectangles] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        convert();
      }
    };

    const convert = () => {
      if (!excalidrawAPI) return;
      
      try {
        const elements = textToNodes(value, wrapInRectangles);
        excalidrawAPI.updateScene({
          elements: convertToExcalidrawElements(elements),
        });
        excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements(), {
          fitToContent: true,
        });
        onConvert();
      } catch (err) {
        console.error('Error converting text:', err);
        throw err;
      }
    };

    useImperativeHandle(ref, () => ({
      convert
    }));

    return (
      <div className={styles.inputContainer}>
        <h2 className={styles.title}>Input</h2>
        <p className={styles.description}>Each line will be converted to a separate node</p>
        <textarea 
          className={styles.textarea}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          placeholder="Enter text, each line will be a separate node"
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={wrapInRectangles}
            onChange={(e) => setWrapInRectangles(e.target.checked)}
          />
          Wrap text in rectangles
        </label>
      </div>
    );
  }
);

TextToNodesInput.displayName = 'TextToNodesInput';

export default React.memo(TextToNodesInput);
