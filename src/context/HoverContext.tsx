import * as React from 'react';

export interface HoverContextProps {
  startRow: number;
  endRow: number;
  onHover: (start: number, end: number) => void;
}

const HoverContext = React.createContext<HoverContextProps>({} as any);

export default HoverContext;
