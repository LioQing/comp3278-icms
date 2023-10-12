import React from 'react';
import { Link } from 'react-router-dom';

export interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

function Hyperlink({ to, children }: LinkProps) {
  return (
    <Link to={to} style={{ color: 'grey' }}>
      {children}
    </Link>
  );
}

export default Hyperlink;
