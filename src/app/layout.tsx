import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers/tanstack-provider';
import { AuthProvider } from '@/app/providers/session-provider';
import { TranslationProvider } from '@/app/providers/translation-provider';
import { siteConfig } from '@/configs/site';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={siteConfig.description} />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen w-full`}>
        <Providers>
          <AuthProvider>
            <TranslationProvider>
              {children}
              <Toaster />
            </TranslationProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
