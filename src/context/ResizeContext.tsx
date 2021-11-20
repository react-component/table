import * as React from 'react';
import type { IColumnResizeObserver } from '../hooks/useColumnResizeObserver';

interface ResizeContextProps {
  columnResizeObserver: IColumnResizeObserver<React.Key>;
}

const ResizeContext = React.createContext<ResizeContextProps>(null);

export default ResizeContext;
