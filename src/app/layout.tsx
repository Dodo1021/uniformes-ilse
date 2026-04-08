import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uniformes Ilse",
  description:
    "Uniformes quirúrgicos y zapatos de hospital — calidad profesional para personal médico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body className="min-h-screen bg-white text-[var(--color-navy)]">
        {children}
      </body>
    </html>
  );
}
