import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// import { Inter } from "next/font/google"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseProvider } from '@/lib/supabase/supabase-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Interview Test Flight',
  description: 'JD + CV analysis + mock interviews',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {/* <body className={inter.className}> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            {children}
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
//     </html>
//   );
// }
