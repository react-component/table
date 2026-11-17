import { useContext } from '@rc-component/context';
import { clsx } from 'clsx';
import * as React from 'react';
import TableContext from '../context/TableContext';
import { StaticContext } from './context';

const BodyHolder = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const { classNames, styles } = useContext(TableContext, ['classNames', 'styles']);
    const { getComponent } = useContext(StaticContext, ['getComponent']);
    const Component = getComponent(['body', 'wrapper'], 'div');

    return (
      <Component
        {...props}
        ref={ref}
        className={clsx(className, classNames?.body?.holder)}
        style={{ ...style, ...styles?.body?.holder }}
      />
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  BodyHolder.displayName = 'BodyHolder';
}

export default BodyHolder;
