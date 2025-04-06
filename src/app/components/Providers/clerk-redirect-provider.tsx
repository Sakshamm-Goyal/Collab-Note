'use client';
import React, { useEffect } from 'react';



type ClerkRedirectProviderLayoutProps = {
  children: React.ReactNode;
};

const ClerkRedirectProviderLayout: React.FC<ClerkRedirectProviderLayoutProps> = ({
  children,
}) => {
    useEffect(() => {
        if (window.location.pathname === '/CLERKJS.NAVIGATE.COMPLETE') {
            window.location.href = '/rooms';
        }
    }, []);
  return (
    <div suppressContentEditableWarning suppressHydrationWarning>
      {children}
    </div>
  );
};

export default ClerkRedirectProviderLayout;
