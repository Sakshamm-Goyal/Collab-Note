'use client';

import React, { useEffect, useState, useTransition } from 'react';
import {
  ChevronDown,
  FileText,
  Home,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  Edit2,
  X,
} from 'lucide-react';
import { SignedIn, useSession, UserButton } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/initSupabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useThemeAndSidebar } from '../context/ThemeContext';
import {
  createNewRoom,
  fetchAccessedRooms,
  fetchMyRooms,
  renameRoom,
} from '../actions/supabase-action';

type Room = {
  id: string;
  userId: string;
  Name: string | null;
  Description: string | null;
  created_at: string;
  Members: string[];
  Admins: string[];
};

type UserRooms = Room[] | null;

const SideBar = () => {
  const { session } = useSession();
  const [myRooms, setMyRooms] = useState<UserRooms>(null);
  const [accessedRooms, setAccessedRooms] = useState<UserRooms>(null);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomMembers, setNewRoomMembers] = useState('');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const roomId = usePathname().split('/')[2];
  const { theme, isSidebarOpen, isCollapsed, toggleSidebar, toggleCollapse } =
    useThemeAndSidebar();

  useEffect(() => {
    const fetchRooms = async () => {
      if (session?.user?.id) {
        const createdRooms = await fetchMyRooms(session.user.id);
        setMyRooms(createdRooms);

        const memberRooms = await fetchAccessedRooms(
          session.user.id,
          session.user?.emailAddresses[0].emailAddress
        );
        setAccessedRooms(memberRooms);
      }
    };
    fetchRooms();
  }, [session?.user?.id]);

  const handleCreateNewRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const memberEmails = newRoomMembers
        .split(',')
        .map((email) => email.trim())
        .filter(email => email.length > 0);
      const userEmail = session?.user?.emailAddresses[0]?.emailAddress;
      const userId = session?.user?.id;

      if (!userEmail || !userId) {
        console.error('User email or ID is missing');
        alert('Error: User information is missing. Please try again.');
        return;
      }

      console.log('Client: Creating room with data:', {
        name: newRoomName,
        description: newRoomDescription,
        members: memberEmails.length > 0 ? `${memberEmails.length} members` : 'No members',
      });

      try {
        const newRoom = await createNewRoom(
          newRoomName,
          newRoomDescription,
          memberEmails,
          userId,
          userEmail
        );
        
        if (newRoom) {
          console.log('Room created successfully, refreshing list');
          // Refresh the rooms list
          const createdRooms = await fetchMyRooms(userId);
          setMyRooms(createdRooms);
          
          setIsNewRoomModalOpen(false);
          setNewRoomName('');
          setNewRoomDescription('');
          setNewRoomMembers('');
          
          alert('Room created successfully!');
        } else {
          alert('Failed to create room. Please try again.');
        }
      } catch (error) {
        console.error('Error creating new room:', error);
        
        // Provide a more helpful message
        let errorMessage = 'An error occurred while creating the room.';
        if (error instanceof Error) {
          errorMessage += ' ' + error.message;
        }
        
        alert(errorMessage);
      }
    });
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      toggleSidebar();
    }
  };

  const handleRenameRoom = async (roomId: string, newName: string) => {
    try {
      const success = await renameRoom(roomId, newName);
      if (success) {
        setMyRooms(
          (prevRooms) =>
            prevRooms?.map((room) =>
              room.id === roomId ? { ...room, Name: newName } : room
            ) || null
        );
        setAccessedRooms(
          (prevRooms) =>
            prevRooms?.map((room) =>
              room.id === roomId ? { ...room, Name: newName } : room
            ) || null
        );
        setEditingRoomId(null);
      }
    } catch (error) {
      console.error('Error renaming room:', error);
    }
  };

  const RoomItem = ({ room, isMyRoom }: { room: Room; isMyRoom: boolean }) => (
    <div className="flex items-center justify-between px-3 py-2">
      {editingRoomId === room.id ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRenameRoom(room.id, editingRoomName);
          }}
          className="flex-grow flex items-center mr-2"
        >
          <Input
            value={editingRoomName}
            onChange={(e) => setEditingRoomName(e.target.value)}
            className="mr-2"
            autoFocus
          />
          <Button type="submit" size="sm" className="mr-1">
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditingRoomId(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </form>
      ) : (
        <Link
          href={`/rooms/${room.id}`}
          onClick={handleLinkClick}
          className={`flex-grow flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 
                    ${
                      room.id === roomId
                        ? theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                        : theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-200'
                    }`}
        >
          <FileText className="w-4 h-4 mr-3" />
          <span className={`truncate ${isCollapsed ? 'hidden' : ''}`}>
            {room.Name}
          </span>
        </Link>
      )}
      {!isCollapsed && isMyRoom && !editingRoomId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditingRoomId(room.id);
            setEditingRoomName(room.Name || '');
          }}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`fixed top-4 left-4 z-50 sm:hidden ${isSidebarOpen ? 'hidden' : ''}`}
      >
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className={`${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                ${isCollapsed ? 'w-20' : 'w-64'} 
                sm:translate-x-0 overflow-y-auto
                ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
      >
        <div className="flex flex-col h-full">
          <div
            className={`flex items-center justify-between h-16 px-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}
          >
            <h1
              onClick={() => router.push('/')}
              className={`text-xl hover:cursor-pointer font-bold ${isCollapsed ? 'hidden' : 'flex-grow truncate'}`}
            >
              Collab Note
            </h1>
            <button
              onClick={toggleCollapse}
              className={`p-1 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 py-4">
            <div className="px-3 mb-4">
              <button
                onClick={() => router.push('/rooms')}
                className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md 
                                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} 
                                transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Home className="w-4 h-4 mr-3" />
                {!isCollapsed && <span>View all Rooms</span>}
              </button>
            </div>
            <div className="px-3 mb-2">
              <h3
                className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${isCollapsed ? 'hidden' : ''}`}
              >
                My Rooms
                <ChevronDown className="w-4 h-4" />
              </h3>
            </div>
            {myRooms?.map((room) => (
              <RoomItem key={room.id} room={room} isMyRoom={true} />
            ))}
            <div className={`px-3 mt-6 mb-2 ${isCollapsed ? 'hidden' : ''}`}>
              <h3
                className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Accessed Rooms
                <ChevronDown className="w-4 h-4" />
              </h3>
            </div>
            {accessedRooms?.map((room) => (
              <RoomItem key={room.id} room={room} isMyRoom={false} />
            ))}
          </nav>
          <div
            className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}
          >
            <div className="flex items-center justify-between">
              <SignedIn>
                <UserButton />
              </SignedIn>
              {!isCollapsed && (
                <Button
                  style={{ color: theme === 'light' ? 'white' : 'black' }}
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setIsNewRoomModalOpen(true)}
                  className="ml-2"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  <span>New Room</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isNewRoomModalOpen} onOpenChange={setIsNewRoomModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateNewRoom} className="space-y-4">
            <div>
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="members">Members (comma-separated emails)</Label>
              <Input
                id="members"
                value={newRoomMembers}
                onChange={(e) => setNewRoomMembers(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                type="text"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              <span>{isLoading ? 'Creating...' : 'Create Room'}</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideBar;
