import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "./globals.scss";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ChatLive",
  description: "실시간 라이브 채팅입니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
