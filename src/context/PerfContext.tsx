import * as React from 'react';

export interface PerfRecord {
  renderWithProps: boolean;
}

// TODO: Remove when use `responsiveImmutable`
const PerfContext = React.createContext<PerfRecord>({
  renderWithProps: false,
});

export default PerfContext;
