import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Geist_Mono, IBM_Plex_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/** 본문과 한글 전체 */
const plexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-sans-kr",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

/** 제목과 숫자의 라틴 문자 (한글은 Plex Sans KR로 대체) */
const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen-grotesk",
  weight: ["500", "600"],
  subsets: ["latin"],
});

/** 코드와 기계값 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

/** 로고 전용 (리디자인 전 폰트 고정) */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "choimory.dev",
  description: "choimory.dev platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plexSansKr.variable} ${familjenGrotesk.variable} ${jetbrainsMono.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
