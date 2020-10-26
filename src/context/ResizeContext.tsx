import * as React from 'react';

interface ResizeContextProps {
  onColumnResize: (columnKey: React.Key, width: number) => void;
  onRowResize: (idx: number, height: number) => void;
}

const ResizeContext = React.createContext<ResizeContextProps>(null);

export default ResizeContext;
