import React, { useState } from 'react';
import SideBar from '../SideBar';
import Header from '../Header';

type Props = {
  children: React.ReactNode;
};

const RoomLayoutProvider = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex">
      <SideBar />
      <div className="flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default RoomLayoutProvider;
