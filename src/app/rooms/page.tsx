'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  FileText,
  Users,
  Calendar,
  Search,
  PlusCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { supabase } from '../lib/initSupabase';
import { useThemeAndSidebar } from '../context/ThemeContext';
import { fetchAccessedRooms, fetchMyRooms } from '../actions/supabase-action';

type Room = {
  id: string;
  userId: string;
  Name: string | null;
  Description: string | null;
  created_at: string;
  Members: string[];
  Admins: string[];
};

const RoomsPage = () => {
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [accessedRooms, setAccessedRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { user } = useUser();
  const { theme, isCollapsed } = useThemeAndSidebar();

  useEffect(() => {
    const fetchRooms = async () => {
      if (user?.id && user?.primaryEmailAddress?.emailAddress) {
        const userEmail = user.primaryEmailAddress.emailAddress;

        const createdRooms = await fetchMyRooms(user.id);
        setMyRooms(createdRooms);
        const memberRooms = await fetchAccessedRooms(user.id, userEmail);
        setAccessedRooms(memberRooms);
      }
    };

    fetchRooms();
  }, [user]);
  const RoomCard = ({ room }: { room: Room }) => (
    <div
      onClick={() => router.push(`/rooms/${room.id}`)}
      className={`p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
          : 'bg-white hover:bg-gray-50 text-gray-800'
      }`}
    >
      <h3 className="text-lg font-semibold mb-2 truncate">{room.Name}</h3>
      <p
        className={`text-sm mb-4 h-12 overflow-hidden ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
      >
        {room.Description}
      </p>
      <div className="flex justify-between items-center text-xs">
        <span className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {room.Members.length + room.Admins.length}
        </span>
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(room.created_at).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            room.userId === user?.id
              ? 'bg-green-200 text-green-800'
              : 'bg-blue-200 text-blue-800'
          }`}
        >
          {room.userId === user?.id
            ? 'Owner'
            : room.Admins.includes(
                  user?.primaryEmailAddress?.emailAddress || ''
                )
              ? 'Admin'
              : 'Member'}
        </span>
      </div>
    </div>
  );

  const EmptyState = ({ type }: { type: 'my' | 'accessed' }) => (
    <div
      className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
        {type === 'my' ? <FileText size={24} /> : <ExternalLink size={24} />}
      </div>
      <h3
        className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
      >
        {type === 'my' ? 'No rooms created yet' : 'No accessed rooms'}
      </h3>
      <p
        className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {type === 'my'
          ? 'Create your first room to start collaborating'
          : "You're not a member of any rooms yet"}
      </p>
    </div>
  );

  const RoomSection = ({
    rooms,
    title,
    type,
  }: {
    rooms: Room[];
    title: string;
    type: 'my' | 'accessed';
  }) => (
    <section className="space-y-4">
      <h2
        className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
      >
        {title}
      </h2>
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState type={type} />
      )}
    </section>
  );

  const filteredMyRooms = myRooms.filter((room) =>
    room.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessedRooms = accessedRooms.filter((room) =>
    room.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hiddene ${
        isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
      } px-6 py-8 ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1
            className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
          >
            Your Rooms
          </h1>
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-full focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-400'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
              }`}
            />
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
            />
          </div>
        </div>

        <RoomSection rooms={filteredMyRooms} title="My Rooms" type="my" />
        <RoomSection
          rooms={filteredAccessedRooms}
          title="Accessed Rooms"
          type="accessed"
        />
      </div>
    </div>
  );
};

export default RoomsPage;
