import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ЦЖС Порталы | Магистральдық желі дирекциясы",
    template: "%s | ЦЖС Порталы",
  },
  description:
    "\"ҚТЖ\" ҰК\" АҚ Магистральдық желі дирекциясы - корпоративтік ақпараттық портал",
  manifest: "/manifest.json",
  themeColor: "#003DA5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ЦЖС Порталы",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
