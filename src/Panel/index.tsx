import * as React from 'react';

export interface TitleProps {
  className: string;
  children: React.ReactNode;
  style: React.CSSProperties;
}

function Panel({ className, style, children }: TitleProps) {
  return <div className={className} style={style}>{children}</div>;
}

export default Panel;
