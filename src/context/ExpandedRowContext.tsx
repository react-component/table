import { createContext } from '../ContextSelector';

export interface ExpandedRowProps {
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
  horizonScroll: boolean;
}

const ExpandedRowContext = createContext<ExpandedRowProps>(null);

export default ExpandedRowContext;
