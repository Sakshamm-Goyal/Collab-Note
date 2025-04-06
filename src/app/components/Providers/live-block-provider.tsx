'use client';
import { LiveblocksProvider } from '@liveblocks/react';
import React from 'react';

type LiveBlocksProvidersProps = {
  children: React.ReactNode;
};

const LiveblocksProviderLayout: React.FC<LiveBlocksProvidersProps> = ({
  children,
}) => {
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
};

export default LiveblocksProviderLayout;
