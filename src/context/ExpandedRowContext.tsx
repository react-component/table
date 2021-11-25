import * as React from 'react';

export interface ExpandedRowProps {
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
}

const ExpandedRowContext = React.createContext<ExpandedRowProps>(null);

export default ExpandedRowContext;
