import { createContext } from 'react';

interface ResizeContextProps {
  onRowResize: (rowIndex: number, height: number) => void;
}

const ResizeContext = createContext<ResizeContextProps>(null);

export default ResizeContext;
