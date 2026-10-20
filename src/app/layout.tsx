import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhookhMap — India ka asli food map",
  description: "Discover India's best street food, thelas, dhabas & heritage eateries. Dish-first food discovery with proof-based reviews.",
  keywords: ["street food", "india", "food map", "dhaba", "thela", "biryani", "chaat", "kebab"],
  openGraph: {
    title: "BhookhMap — India ka asli food map",
    description: "Discover India's best street food with proof-based reviews",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFBF5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
