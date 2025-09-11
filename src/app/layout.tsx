import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brain Sharp Girls - Cognitive Training App",
  description: "Interactive brain training games and cognitive exercises designed specifically for girls to enhance memory, math skills, logic, and vocabulary.",
  keywords: "brain training, cognitive exercises, memory games, math challenges, logic puzzles, word games, girls education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50`}>
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}