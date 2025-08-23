import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Engla - Next Generation Voice AI Platform",
  description: "Transform your voice into intelligence with Engla's advanced AI-powered platform. Experience the future of voice interaction with unprecedented accuracy and multilingual support.",
  keywords: "voice AI, speech recognition, natural language processing, AI assistant, voice interface, Engla",
  authors: [{ name: "Engla Team" }],
  openGraph: {
    title: "Engla - Next Generation Voice AI Platform",
    description: "Transform your voice into intelligence with Engla's advanced AI-powered platform.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engla - Next Generation Voice AI Platform",
    description: "Transform your voice into intelligence with Engla's advanced AI-powered platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
