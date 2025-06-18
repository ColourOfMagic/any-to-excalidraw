import {ExcalidrawElementSkeleton} from "@excalidraw/excalidraw/types/data/transform";

/**
 * Converts text to Excalidraw elements
 * @param inputText Text to convert
 * @param wrapInRectangles Whether to wrap text in rectangles
 * @returns Array of Excalidraw elements
 */
export function textToNodes(
  inputText: string,
  wrapInRectangles: boolean = false
): ExcalidrawElementSkeleton[] {
  const elements: ExcalidrawElementSkeleton[] = [];

  // Если есть текст, добавляем элементы из него
  if (inputText) {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    
    if (wrapInRectangles) {
      // Create rectangles with text labels
      const rectangleElements = lines.map((line, index) => ({
        id: `node-${Date.now()}-${index}`,
        type: 'rectangle',
        x: 100,
        y: 100 + index * 120,
        width: 200,
        height: 80,
        roundness: {
          type: 3,
          value: 16,
        },
        label: {
          text: line,
        },
      } as ExcalidrawElementSkeleton));
      
      elements.push(...rectangleElements);
    } else {
      // Create plain text elements
      const textElements = lines.map((line, index) => ({
        id: `node-${Date.now()}-${index}`,
        type: 'text',
        x: 100,
        y: 100 + index * 100,
        text: line,
        fontSize: 20,
        textAlign: 'center',
        verticalAlign: 'middle',
      } as ExcalidrawElementSkeleton));
      
      elements.push(...textElements);
    }
  }

  return elements;
}

/**
 * Converts markdown tasklist to Excalidraw elements
 * @param inputText Markdown tasklist text to convert
 * @returns Array of Excalidraw elements
 */
export function tasklistToNodes(
  inputText: string
): ExcalidrawElementSkeleton[] {
  const elements: ExcalidrawElementSkeleton[] = [];

  if (inputText) {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const tasks: Array<{ text: string; isCompleted: boolean }> = [];
    
    // Parse all tasks first
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const taskMatch = trimmedLine.match(/^-\s*\[([ xX])\]\s*(.+)$/);
      
      if (taskMatch) {
        const isCompleted = taskMatch[1].toLowerCase() === 'x';
        const taskText = taskMatch[2];
        tasks.push({ text: taskText, isCompleted });
      } else if (trimmedLine) {
        // Handle non-tasklist lines as regular tasks
        tasks.push({ text: trimmedLine, isCompleted: false });
      }
    });
    
    // Create nodes and arrows
    tasks.forEach((task, index) => {
      const nodeX = 100 + index * 250; // Horizontal spacing between nodes
      const nodeY = 200;
      const nodeWidth = 200;
      const nodeHeight = 80;
      
      // Generate unique ID for rectangle
      const rectangleId = `task-node-${Date.now()}-${index}`;
      
      // Determine colors based on completion status
      const strokeColor = task.isCompleted ? '#888888' : '#000000';
      const backgroundColor = task.isCompleted ? '#f0f0f0' : 'transparent';
      const fillStyle = task.isCompleted ? 'hachure' : 'solid';
      
      // Create task node (rectangle) with label text
      const taskNode = {
        id: rectangleId,
        type: 'rectangle',
        x: nodeX,
        y: nodeY,
        width: nodeWidth,
        height: nodeHeight,
        strokeColor: strokeColor,
        backgroundColor: backgroundColor,
        fillStyle: fillStyle,
        roundness: {
          type: 3,
          value: 16,
        },
        label: {
          text: task.text,
        },
      } as ExcalidrawElementSkeleton;
      
      elements.push(taskNode);
      
      // Create arrow to next node (if not the last node)
      if (index < tasks.length - 1) {
        const arrowStartX = nodeX + nodeWidth;
        const arrowStartY = nodeY + nodeHeight / 2;
        const arrowEndX = nodeX + 250; // Start of next node
        
        const arrow = {
          id: `arrow-${Date.now()}-${index}`,
          type: 'arrow',
          x: arrowStartX,
          y: arrowStartY,
          width: arrowEndX - arrowStartX,
          height: 0,
          points: [[0, 0], [arrowEndX - arrowStartX, 0]],
          endArrowhead: 'arrow',
        } as ExcalidrawElementSkeleton;
        
        elements.push(arrow);
      }
    });
  }

  return elements;
}
