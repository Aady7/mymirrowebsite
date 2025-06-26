import { Navigation } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer";
import Provider from './components/provider';
import "./globals.css";
import ConditionalNav from './components/ConditionalNav';
import ScrollToTop from './components/ScrollToTop';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MyMirro",
  description: "Your fashion stylist",
  icons: {
    icon: [
      { url: '/assets/logo.png', type: 'image/png' },
      { url: '/assets/logoAtFooter.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/assets/logo.png'],
    apple: [
      { url: '/assets/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/assets/logo.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png" />
        <link rel="icon" type="image/svg+xml" href="/assets/logoAtFooter.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo.png" />
        <link rel="mask-icon" href="/assets/logoAtFooter.svg" color="#007e90" />
        <meta name="theme-color" content="#007e90" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`} 
      >
        <Provider>
          <ScrollToTop />
          <ConditionalNav />
          {children}
        </Provider>
        
        {/*footer*/}
        <Footer/>
      </body>
    </html>
  );
}
