import {ExcalidrawElementSkeleton} from "@excalidraw/excalidraw/types/data/transform";

/**
 * Converts text to Excalidraw elements
 * @param inputText Text to convert
 * @returns Array of Excalidraw elements
 */
export function textToNodes(
  inputText: string
): ExcalidrawElementSkeleton[] {
  const elements: ExcalidrawElementSkeleton[] = [];

  // Если есть текст, добавляем элементы из него
  if (inputText) {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    
    const textElements = lines.map((line, index) => ({
      id: `node-${Date.now()}-${index}`,
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
      version: 1,
      versionNonce: 1,
    } as ExcalidrawElementSkeleton));
    
    elements.push(...textElements);
  }

  return elements;
}
