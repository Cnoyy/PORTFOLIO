import type { Metadata } from "next";
import { Geist, Geist_Mono, Titan_One, Lilita_One, Averia_Gruesa_Libre } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titanOne = Titan_One({
  variable: "--font-titan-one",
  weight: "400",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  variable: "--font-lilita-one",
  weight: "400",
  subsets: ["latin"],
});

const averiaGruesaLibre = Averia_Gruesa_Libre({
  variable: "--font-averia-gruesa-libre",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "C.noy",
  description:
    "Professional portfolio of Shinoy - A Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View my projects and get in touch.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js",
    "UI/UX Designer",
    "Portfolio",
  ],
  authors: [{ name: "Shinoy" }],
  icons: {
    icon: "/shinoy.jpg",
    apple: "/shinoy.jpg",
  },
  openGraph: {
    title: "Shinoy | Full Stack Developer & UI/UX Designer",
    description:
      "Professional portfolio showcasing web development projects and skills.",
    type: "website",
    images: ["/shinoy.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titanOne.variable} ${lilitaOne.variable} ${averiaGruesaLibre.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
