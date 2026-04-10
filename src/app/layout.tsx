import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
