import { createContext } from '@rc-component/context';
import type { TableSticky } from '../interface';

export interface StaticContextProps {
  scrollY: number;
  listItemHeight: number;
  sticky: boolean | TableSticky;
}

export const StaticContext = createContext<StaticContextProps>(null);

export interface GridContextProps {
  columnsOffset: number[];
}

export const GridContext = createContext<GridContextProps>(null);
