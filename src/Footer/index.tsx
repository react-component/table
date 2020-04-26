import * as React from 'react';
import TableContext from '../context/TableContext';

export interface FooterProps<RecordType> {
  children: React.ReactNode;
}

function Footer<RecordType>({ children }: FooterProps<RecordType>) {
  const { prefixCls } = React.useContext(TableContext);
  return <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>;
}

export default Footer;
