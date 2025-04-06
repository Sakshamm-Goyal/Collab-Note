import LiveblocksProviderLayout from '@/app/components/Providers/live-block-provider';
import RoomProviderLayout from '@/app/components/Providers/RoomProvider';
import { ThemeAndSidebarProvider } from '@/app/context/ThemeContext';
import React from 'react';

type Props = {
  children: React.ReactNode;
  params: {
    roomId: string;
  };
};

const layout = ({ children, params }: Props) => {
  return (
    <LiveblocksProviderLayout>
      {/* <ThemeAndSidebarProvider> */}

      <RoomProviderLayout roomId={params.roomId}>{children}</RoomProviderLayout>
      {/* </ThemeAndSidebarProvider> */}
    </LiveblocksProviderLayout>
  );
};

export default layout;
