import * as React from 'react';

export interface PerfRecord {
  renderWithProps: boolean;
}

const PerfContext = React.createContext<PerfRecord>(null!);

export default PerfContext;
