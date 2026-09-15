import type { Metadata } from "next";
import "./globals.css";
import "./transitions.css";

export const metadata: Metadata = {
  title: "Forge Ink — Night Press social graphics",
  description:
    "Compose fixed-size social graphics from local images, text, and templates. Export SVG or PDF. All data stays on your machine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
