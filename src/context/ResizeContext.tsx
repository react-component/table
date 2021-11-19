import * as React from 'react';
import type useColumnResizeObserver from '../hooks/useColumnResizeObserver';

interface ResizeContextProps {
  columnResizeObserver: ReturnType<typeof useColumnResizeObserver>;
}

const ResizeContext = React.createContext<ResizeContextProps>(null);

export default ResizeContext;
