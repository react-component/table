import { createContext } from '@rc-component/context';
import type { GetComponent, TableSticky } from '../interface';

export interface StaticContextProps {
  scrollY: number;
  listItemHeight: number;
  sticky: boolean | TableSticky;
  getComponent: GetComponent;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const StaticContext = createContext<StaticContextProps>(null);

export interface GridContextProps {
  columnsOffset: number[];
}

export const GridContext = createContext<GridContextProps>(null);
