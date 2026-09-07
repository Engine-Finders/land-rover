import "./globals.css";
import { Lora } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FreeQuoteSticky from "@/components/shared/FreeQuoteForm";
import { ThemeProvider } from "@/components/shared/themeProvider";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://bmwengines.uk/"),
  title: "BMW Reliability Guide",
  description: "The UK's Most Trusted BMW Ownership Guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full ${lora.variable}`}>
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-text)] antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[var(--color-page)] text-[var(--color-text)]">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <FreeQuoteSticky />
        </ThemeProvider>
      </body>
    </html>
  );
}
