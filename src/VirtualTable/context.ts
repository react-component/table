import { createContext } from '@rc-component/context';

export interface StaticContextProps {
  scrollX: number;
  scrollY: number;
  listItemHeight: number;
}

export const StaticContext = createContext<StaticContextProps>(null);

export interface GridContextProps {
  columnsOffset: number[];
}

export const GridContext = createContext<GridContextProps>(null);
