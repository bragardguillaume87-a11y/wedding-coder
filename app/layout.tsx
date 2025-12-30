import type { Metadata } from "next";
import { Geist, Crimson_Pro } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Solène & Le Rond se marient",
  description: "Un mariage itinérant à travers villes et pays. Nous viendrons à vous pour célébrer l'amour chez vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${crimsonPro.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
