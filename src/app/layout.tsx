import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/use-auth'; // Assuming AuthProvider wraps context

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Nexus Alumni',
    template: '%s | Nexus Alumni',
  },
  description: 'A smart alumni web-based platform for connection, mentorship, and community growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
