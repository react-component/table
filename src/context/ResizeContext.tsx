import type * as React from 'react';
import { createContext } from '@rc-component/context';

interface ResizeContextProps {
  onColumnResize: (columnKey: React.Key, width: number) => void;
}

const ResizeContext = createContext<ResizeContextProps>();

export default ResizeContext;
