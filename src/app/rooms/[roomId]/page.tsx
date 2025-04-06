'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react';
import { supabase } from '../../lib/initSupabase';
import Editor from '@/app/components/Editor';
import '../../css/editor-custom.css';
import { useThemeAndSidebar } from '@/app/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    roomId: string;
  };
};

type RoomData = {
  userId: string;
  Admins: string[];
  Members: string[];
};

const NoAccessPage = () => {
  const { theme } = useThemeAndSidebar();
  const router = useRouter();

  return (
    <div
      className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl mb-8">
          You dont have permission to view this room.
        </p>
        <Button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

const RoomPage = ({ params }: Props) => {
  const room = useRoom();
  const { user } = useUser();
  const [isOwner, setIsOwner] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, isCollapsed } = useThemeAndSidebar();

  useEffect(() => {
    const checkAccess = async () => {
      if (user?.id && user?.primaryEmailAddress?.emailAddress) {
        try {
          const { data, error } = await supabase
            .from('Rooms')
            .select('userId, Admins, Members')
            .eq('id', params.roomId)
            .single();

          if (error) throw error;

          if (data) {
            const roomData = data as RoomData;
            const userEmail = user.primaryEmailAddress.emailAddress;
            const isOwner = roomData.userId === user.id;
            const isAdmin = roomData.Admins.includes(userEmail);
            const isMember = roomData.Members.includes(userEmail);

            setIsOwner(isOwner);
            setHasAccess(isOwner || isAdmin || isMember);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error('Error checking room access:', error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAccess();
  }, [user, params.roomId]);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <div className="liveBlockloader"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return <NoAccessPage />;
  }

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
      } ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
    >
      <main className="flex-1 overflow-hidden">
        <Editor isOwner={isOwner} roomId={params.roomId} />
      </main>
    </div>
  );
};

export default RoomPage;
