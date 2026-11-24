import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: {
    default: "Al Zahra Human Resource Consultancy",
    template: "%s · Al Zahra HR",
  },
  description:
    "Al Zahra Human Resource Consultancy — licensed Nepali recruitment agency placing skilled workers across the Gulf, Malaysia and Europe.",
  icons: {
    icon: [
      { url: "/image/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/image/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
