import * as React from 'react';

export interface TitleProps {
  className: string;
  style: React.CSSProperties;
}

const Panel: React.FC<React.PropsWithChildren<TitleProps>> = props => {
  const { children, className, style } = props;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default Panel;
