import { textToNodes } from './textToNodes';

describe('textToNodes', () => {
  test('should return empty array when text is empty', () => {
    const result = textToNodes('');
    
    expect(result).toHaveLength(0);
  });

  test('should create elements for each non-empty line of text', () => {
    const inputText = 'Line 1\nLine 2\n\nLine 3';
    const result = textToNodes(inputText);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('text', 'Line 1');
    
    expect(result[1]).toHaveProperty('text', 'Line 2');
    expect(result[2]).toHaveProperty('text', 'Line 3');
  });

  test('should create single element for single line', () => {
    const inputText = 'Single line';
    const result = textToNodes(inputText);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('text', 'Single line');
    expect(result[0].type).toBe('text');
  });

  test('should position elements correctly vertically', () => {
    const inputText = 'Line 1\nLine 2\nLine 3';
    const result = textToNodes(inputText);
    
    expect(result[0].y).toBe(100);
    expect(result[1].y).toBe(200);
    expect(result[2].y).toBe(300);
  });

  test('should set correct properties for text elements', () => {
    const inputText = 'Test line';
    const result = textToNodes(inputText);
    
    expect(result[0]).toMatchObject({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      text: 'Test line',
      fontSize: 20,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: null,
      isDeleted: false,
      version: 1,
      versionNonce: 1,
    });
  });
});
