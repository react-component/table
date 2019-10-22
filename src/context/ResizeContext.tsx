import { createContext } from 'react';

interface ResizeContextProps {
  onColumnResize: (colIndex: number, width: number) => void;
}

const ResizeContext = createContext<ResizeContextProps>(null);

export default ResizeContext;
