import { Navigation } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer";
import Provider from './components/provider';
import "./globals.css";
import ConditionalNav from './components/ConditionalNav';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MyMirro - AI-Powered Personal Fashion Stylist & Style Recommendations",
    template: "%s | MyMirro"
  },
  description: "Discover your perfect style with MyMirro's AI-powered fashion recommendations. Take our style quiz, get personalized clothing suggestions, and find curated outfits tailored to your personality and preferences. Your personal fashion stylist powered by AI.",
  keywords: [
    "MyMirro", "Mirro", "fashion stylist", "personal stylist", "AI fashion", "clothing recommendations", 
    "style quiz", "personalized fashion", "outfit recommendations", "fashion AI", "style advice",
    "wardrobe styling", "fashion consultant", "clothing suggestions", "style personality",
    "fashion trends", "outfit planner", "style guide", "fashion technology", "smart styling",
    "personalized outfits", "fashion matching", "style analysis", "clothing coordination",
    "fashion recommendation app", "AI stylist app", "personal shopping assistant"
  ],
  authors: [{ name: "MyMirro Team" }],
  creator: "MyMirro",
  publisher: "MyMirro",
  applicationName: "MyMirro",
  generator: "Next.js",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mymirro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MyMirro - AI-Powered Personal Fashion Stylist',
    description: 'Discover your perfect style with AI-powered fashion recommendations. Take our style quiz and get personalized outfit suggestions tailored just for you.',
    siteName: 'MyMirro',
    images: [
      {
        url: '/assets/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'MyMirro - AI-Powered Personal Fashion Stylist',
      },
      {
        url: '/assets/logo.png',
        width: 512,
        height: 512,
        alt: 'MyMirro Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyMirro - AI-Powered Personal Fashion Stylist',
    description: 'Discover your perfect style with AI-powered fashion recommendations and personalized styling.',
    images: ['/assets/og-banner.png'],
    creator: '@mymirro',
    site: '@mymirro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Fashion & Style',
  classification: 'Fashion Technology',
  other: {
    'theme-color': '#007e90',
    'color-scheme': 'light',
  },
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
        <meta name="impact-site-verification" content="08469440-e186-45a0-b97d-027b3e55ee53" />
        
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PP44DZ7T"></script>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VE0MRBMNF5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VE0MRBMNF5', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`} 
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PP44DZ7T"
                  height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        
        <Provider>
          <AnalyticsWrapper>
            <ScrollToTop />
            <ConditionalNav />
            <Toaster position="top-centre"/>
            {children}
          </AnalyticsWrapper>
        </Provider>
        
        {/*footer*/}
        <Footer/>
        
        {/* CueLinks Affiliate Script - Added just before closing body tag for optimal performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var cId = '237261';
              var cuelinksLoaded = false;

              (function(d, t) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = (document.location.protocol == 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/')  + 'cuelinksv2.js';
                
                s.onload = function() {
                  cuelinksLoaded = true;
                };
                
                s.onerror = function() {
                  // CueLinks script blocked - set flag for manual handling
                  window.cuelinksBlocked = true;
                  console.warn('CueLinks script blocked by ad blocker. Affiliate links will redirect manually.');
                };
                
                document.getElementsByTagName('body')[0].appendChild(s);
              }());
              
              // Check if CueLinks loaded after 3 seconds
              setTimeout(function() {
                if (!cuelinksLoaded) {
                  window.cuelinksBlocked = true;
                }
              }, 3000);
            `,
          }}
        />
      </body>
    </html>
  );
}
