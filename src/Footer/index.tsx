import * as React from 'react';
import TableContext from '../context/TableContext';
import Cell from './Cell';
import Row from './Row';

export interface FooterProps {
  children: React.ReactNode;
}

function Footer({ children }: FooterProps) {
  const { prefixCls } = React.useContext(TableContext);
  return <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>;
}

export default Footer;

export const FooterComponents = {
  Cell,
  Row,
};
