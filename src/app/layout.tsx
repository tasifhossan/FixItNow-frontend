import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FixItNow | On-Demand Home Service Marketplace',
  description: 'Connect with verified, professional technicians for all your home repair and maintenance needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
