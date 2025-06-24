import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Arsenal-Bold.ttf",
  variable: "--font-geist-sans",
  weight: "700",
});
const geistMono = localFont({
  src: "./fonts/Arsenal-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Делико",
  description: "Сгенерируем любой рецепт - Делико",
  icons: {
    icon: "/fon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="shortcut icon" href="https://delico.vercel.app/fon.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="relative max-w-[1440px] w-full mx-auto h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
