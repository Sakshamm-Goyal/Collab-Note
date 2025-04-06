import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ClerkRedirectProviderLayout from './components/Providers/clerk-redirect-provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Collab Note',
  description: 'Collaborative AI-powered note-taking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <ClerkRedirectProviderLayout>

        <body className={inter.className}>{children}</body>
        </ClerkRedirectProviderLayout>
      </ClerkProvider>
    </html>
  );
}
