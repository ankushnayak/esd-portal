import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { appMetadata } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: appMetadata.name,
    template: `%s | ${appMetadata.shortBrand}`,
  },
  description: appMetadata.description,
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
