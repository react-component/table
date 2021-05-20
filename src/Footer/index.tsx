import * as React from 'react';
import TableContext from '../context/TableContext';
import Summary from './Summary';

export interface FooterProps {
  children: React.ReactNode;
}

function Footer({ children }: FooterProps) {
  const { prefixCls } = React.useContext(TableContext);
  return <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>;
}

export default Footer;

export const FooterComponents = Summary;
