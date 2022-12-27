import { createContext } from '@rc-component/context';

export interface HoverContextProps {
  startRow: number;
  endRow: number;
  onHover: (start: number, end: number) => void;
}

const HoverContext = createContext<HoverContextProps>();

export default HoverContext;
