import React from 'react';
import TableContext from './context';

export interface HeaderProps {}

function Header(props: HeaderProps): React.ReactElement {
  const context = React.useContext(TableContext);

  return <thead></thead>;
}

export default Header;
