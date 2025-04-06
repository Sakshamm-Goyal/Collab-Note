'use client';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import React from 'react';
import { useParams } from 'next/navigation';
import LiveCursorProvider from './LiveCursorProvider';
import '../../css/editor-custom.css';
type Props = {
  children: React.ReactNode;
  roomId: string;
};

const RoomProviderLayout = (props: Props) => {
  return (
    <RoomProvider id={props.roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<div className="liveBlockloader"></div>}>
        <LiveCursorProvider>{props.children}</LiveCursorProvider>
      </ClientSideSuspense>{' '}
    </RoomProvider>
  );
};

export default RoomProviderLayout;
