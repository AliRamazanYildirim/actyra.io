import Stars from '@/components/Stars';
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen  dark:bg-[#0d0e25] flex items-center justify-center">
      <Stars/>
      {children}
    </div>
  );
};

export default AuthLayout;
