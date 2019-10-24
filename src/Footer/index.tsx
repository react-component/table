import * as React from 'react';

export interface FooterProps {
  children: React.ReactNode;
}

function Footer({ children }: FooterProps) {
  return <tfoot>{children}</tfoot>;
}

export default Footer;
