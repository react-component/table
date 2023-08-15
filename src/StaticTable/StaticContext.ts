import { createContext } from '@rc-component/context';

export interface StaticContextProps {
  scrollX: number;
  scrollY: number;
}

const StaticContext = createContext<StaticContextProps>(null);

export default StaticContext;
