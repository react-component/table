import * as React from 'react';

interface ResizeContextProps {
  onColumnResize: (columnKey: React.Key, width: number) => void;
}

export const ResizeContext = React.createContext<ResizeContextProps>(null);
