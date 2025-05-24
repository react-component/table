import * as React from 'react';

export interface TitleProps {
  className: string;
  children: React.ReactNode;
}

function Panel({ className, children }: TitleProps) {
  return <div className={className}>{children}</div>;
}

export default Panel;
