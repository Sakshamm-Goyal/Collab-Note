import { useMyPresence, useOthers } from '@liveblocks/react';
import React, { PointerEvent } from 'react';
import FollowPointer from '../FollowPointer';

type Props = {
  children: React.ReactNode;
};

const LiveCursorProvider = ({ children }: Props) => {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const cursor = {
      x: Math.floor(e.pageX),
      y: Math.floor(e.pageY),
    };
    updateMyPresence({ cursor });
  };
  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {/* Render cursors */}
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, info, presence }) => (
          <FollowPointer
            key={connectionId}
            x={presence.cursor?.x!}
            y={presence.cursor?.y!}
            info={info}
          />
        ))}
      {children}
    </div>
  );
};

export default LiveCursorProvider;
