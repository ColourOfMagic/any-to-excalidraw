import React, { ChangeEvent, useState, useImperativeHandle, forwardRef } from 'react';
import styles from './InputComponents.module.css';
import { tasklistToNodes } from '../../utils/textToNodes';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

interface TasklistToNodesInputProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onConvert: () => void;
}

export interface TasklistToNodesInputRef {
  convert: () => void;
}

const TasklistToNodesInput = forwardRef<TasklistToNodesInputRef, TasklistToNodesInputProps>(
  ({ excalidrawAPI, onConvert }, ref) => {
    const [value, setValue] = useState('');

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
        // Use tasklist-specific conversion logic
        const elements = tasklistToNodes(value);
        excalidrawAPI.updateScene({
          elements: convertToExcalidrawElements(elements),
        });
        excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements(), {
          fitToContent: true,
        });
        onConvert();
      } catch (err) {
        console.error('Error converting tasklist:', err);
        throw err;
      }
    };

    useImperativeHandle(ref, () => ({
      convert
    }));

    return (
      <div className={styles.inputContainer}>
        <h2 className={styles.title}>Input</h2>
        <p className={styles.description}>Convert tasklist format to nodes</p>
        <textarea 
          className={styles.textarea}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          placeholder={`Enter markdown tasklist:
- [ ] Task 1
- [x] Completed task
- [ ] Another task`}
        />
      </div>
    );
  }
);

TasklistToNodesInput.displayName = 'TasklistToNodesInput';

export default React.memo(TasklistToNodesInput);
