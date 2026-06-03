import React from 'react';

export const Logo = ({ className = "w-24 h-24" }) => (
  <img 
    src="/logo.png" 
    alt="Rede Solidária Logo" 
    className={className} 
    style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
  />
);

export default Logo;
