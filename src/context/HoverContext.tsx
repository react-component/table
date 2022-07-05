import { createContext } from '../ContextSelector';

export interface HoverContextProps {
  startRow: number;
  endRow: number;
  onHover: (start: number, end: number) => void;
}

const HoverContext = createContext<HoverContextProps>();

export default HoverContext;
