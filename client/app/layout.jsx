import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/global-context";
import { ThemeProvider } from "@/context/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Disha AI",
  description: "Hire like a master!",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </GlobalProvider>
    </ThemeProvider>
  );
}
