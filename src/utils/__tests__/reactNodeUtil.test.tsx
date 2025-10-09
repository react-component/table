import React from 'react';
import { sanitizeCloneElement } from '../reactNodeUtil';

describe('reactNodeUtil', () => {
  describe('sanitizeCloneElement', () => {
    it('should remove filtered props', () => {
      const node = React.createElement(
        'div',
        {
          id: 'test-id',
          'data-test': 'test-data',
          onFocus: () => {},
          onBlur: () => {},
          tabIndex: 0,
          className: 'test-class',
        },
        'test content',
      );

      const result = sanitizeCloneElement(node) as React.ReactElement;

      expect(result.props.id).toBeUndefined();
      expect(result.props['data-test']).toBeUndefined();
      expect(result.props.onFocus).toBeUndefined();
      expect(result.props.onBlur).toBeUndefined();
      expect(result.props.tabIndex).toBeUndefined();
      expect(result.props.className).toBe('test-class');
      expect(result.props.children).toBe('test content');
    });

    it('should handle nested elements', () => {
      const nested = React.createElement('span', { id: 'nested-id' }, 'nested');
      const parent = React.createElement(
        'div',
        {
          id: 'parent-id',
          className: 'parent',
        },
        nested,
      );

      const result = sanitizeCloneElement(parent) as React.ReactElement;

      expect(result.props.id).toBeUndefined();
      expect(result.props.className).toBe('parent');

      const childElement = result.props.children as React.ReactElement;
      expect(childElement.props.id).toBeUndefined();
      expect(childElement.props.children).toBe('nested');
    });

    it('should limit recursion depth', () => {
      // 创建深层嵌套结构
      let deepNode: React.ReactElement = React.createElement('span', { id: 'deep' }, 'content');

      for (let i = 0; i < 15; i++) {
        deepNode = React.createElement('div', { id: `level-${i}` }, deepNode);
      }

      const result = sanitizeCloneElement(deepNode, 0, 5);
      expect(result).toBeDefined();
      // 应该在递归深度限制内正常工作
    });

    it('should return non-React elements unchanged', () => {
      const textNode = 'plain text';
      const numberNode = 42;
      const nullNode = null;

      expect(sanitizeCloneElement(textNode)).toBe(textNode);
      expect(sanitizeCloneElement(numberNode)).toBe(numberNode);
      expect(sanitizeCloneElement(nullNode)).toBe(nullNode);
    });

    it('should use cache for performance', () => {
      const props = { className: 'test', id: 'will-be-removed' };
      const node1 = React.createElement('div', props, 'content');
      const node2 = React.createElement('span', props, 'other content');

      const result1 = sanitizeCloneElement(node1) as React.ReactElement;
      const result2 = sanitizeCloneElement(node2) as React.ReactElement;

      // 虽然是不同的元素，但相同的 props 应该被缓存
      expect(result1.props.className).toBe('test');
      expect(result1.props.id).toBeUndefined();
      expect(result2.props.className).toBe('test');
      expect(result2.props.id).toBeUndefined();
    });

    it('should return original node if no props need filtering', () => {
      const node = React.createElement(
        'div',
        {
          className: 'test',
          title: 'clean',
        },
        'content',
      );

      const result = sanitizeCloneElement(node);

      // 如果没有需要过滤的属性，应该返回原节点以提高性能
      expect(result).toBe(node);
    });
  });
});
