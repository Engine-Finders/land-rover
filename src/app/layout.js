import "./globals.css";
import { Instrument_Sans, Libre_Caslon_Text, Lora } from "next/font/google";
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

// Variant page redesign: Instrument Sans for the hero headline, Libre Caslon for section titles.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://landroverengine.uk"),
  title: {
    default: "The UK's Most Trusted Land Rover & Range Rover Ownership Guide",
    template: "%s | Land Rover & Range Rover Ownership Guide",
  },
  description:
    "Reliability rankings, real failure data, honest repair-vs-replace economics - for every Defender, Discovery, Range Rover, Evoque, Velar and Freelander ever sold in the UK.",
  applicationName: "Land Rover & Range Rover Ownership Guide",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// sets <html data-theme> before first paint, so night-theme visitors never see a day flash
const THEME_SCRIPT = `try{var t=localStorage.getItem("site-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full ${lora.variable} ${instrumentSans.variable} ${libreCaslon.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-text)] antialiased" suppressHydrationWarning>
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
