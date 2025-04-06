import React from 'react';
import RoomLayoutProvider from '../components/Providers/RoomLayoutProvider';
import { ThemeAndSidebarProvider } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ThemeAndSidebarProvider>
      <RoomLayoutProvider>{children}</RoomLayoutProvider>
    </ThemeAndSidebarProvider>
  );
};

export default layout;
