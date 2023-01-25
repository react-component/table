import * as React from 'react';

interface ResizeContextProps {
  onColumnResize: (columnKey: React.Key, width: number) => void;
  resizeLimtMap: Map<React.Key, number>;
  setResizeLimt: (key: React.Key, value: number) => void;
}

const ResizeContext = React.createContext<ResizeContextProps>(null);

export default ResizeContext;
