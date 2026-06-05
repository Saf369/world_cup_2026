import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUNDIAL — World Cup 2026 Predictor",
  description:
    "The ultra-premium FIFA World Cup 2026 prediction platform. AI-powered match predictions, live brackets, group tables, and top scorers — all in one elite experience.",
  keywords: ["World Cup 2026", "football predictor", "FIFA 2026", "Mundial"],
  openGraph: {
    title: "MUNDIAL — World Cup 2026 Predictor",
    description: "Elite World Cup prediction platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
