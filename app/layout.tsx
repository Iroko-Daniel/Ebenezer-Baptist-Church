import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ebenezer Baptist Church",
  description: "Welcome to Ebenezer Baptist Church, 50A Campbell Street, Lagos Island. Join us for worship, fellowship, and community.",
  metadataBase: new URL('https://ebenezerbaptist.org'),
  openGraph: {
    title: "Ebenezer Baptist Church",
    description: "A Place of Worship and Community - Join us for Sunday service at 10:00 AM",
    url: 'https://ebenezerbaptist.org',
    siteName: 'Ebenezer Baptist Church',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Ebenezer Baptist Church Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Ebenezer Baptist Church",
    description: "A Place of Worship and Community",
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
