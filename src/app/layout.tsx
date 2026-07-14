import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/auth-provider";
import LayoutProvider from "@/components/providers/layout-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "10alytics Business Finance Dashboard",
  description: "Internal finance application for 10alytics Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={cn(
          inter.className,
          "bg-slate-50 text-slate-900 antialiased",
        )}
      >
        <AuthProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
