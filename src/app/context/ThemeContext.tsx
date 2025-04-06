'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeAndSidebarContextType {
  theme: Theme;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const ThemeAndSidebarContext = createContext<
  ThemeAndSidebarContextType | undefined
>(undefined);

export const ThemeAndSidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true);
        setIsCollapsed(false);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <ThemeAndSidebarContext.Provider
      value={{
        theme,
        toggleTheme,
        isSidebarOpen,
        toggleSidebar,
        isCollapsed,
        toggleCollapse,
      }}
    >
      {children}
    </ThemeAndSidebarContext.Provider>
  );
};

export const useThemeAndSidebar = () => {
  const context = useContext(ThemeAndSidebarContext);
  if (context === undefined) {
    throw new Error(
      'useThemeAndSidebar must be used within a ThemeAndSidebarProvider'
    );
  }
  return context;
};
