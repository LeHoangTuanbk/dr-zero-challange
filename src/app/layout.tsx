import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const notoSansJP = localFont({
  src: './fonts/noto-sans-jp.woff2',
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dr.Zero — AI Decarbonization Platform',
  description: 'AI-powered emission data management and anomaly resolution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable}  antialiased`}>{children}</body>
    </html>
  );
}
