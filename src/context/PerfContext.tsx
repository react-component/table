import * as React from 'react';

export interface PerfRecord {
  renderWithProps: boolean;
}

const PerfContext = React.createContext<PerfRecord>({
  renderWithProps: false,
});

export default PerfContext;
