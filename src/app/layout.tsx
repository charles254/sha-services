import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialProof from "@/components/SocialProof";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const inter  = Inter ({ subsets: ["latin"], variable: "--font-inter",  display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://shaservices.co.ke"),
  title: {
    default: "SHA Online Services | Social Health Authority Kenya",
    template: "%s | SHA Online Services Kenya",
  },
  description:
    "Fast, secure, and professional SHA (Social Health Authority) services for Kenyans online. Phone change, PIN registration, contribution statements, beneficiary updates and more.",
  keywords: [
    "SHA Kenya online",
    "Social Health Authority services",
    "NHIF replacement Kenya",
    "SHA PIN registration",
    "SHA phone number change",
    "SHA contribution statement",
    "Kenya universal health coverage",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "SHA Online Services Kenya",
    title: "SHA Online Services | Social Health Authority Kenya",
    description:
      "Professional SHA services — phone updates, PIN registration, contribution records, and beneficiary changes. Handled by certified agents.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "SHA Online Services Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHA Online Services Kenya",
    description: "Fast, secure Social Health Authority services handled by certified agents.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SHA Online Services Kenya",
              url: "https://shaservices.co.ke",
              logo: "https://shaservices.co.ke/logo.png",
              description: "Certified SHA agent services for Kenyan citizens.",
              areaServed: "KE",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254-719-628-275",
                contactType: "customer service",
                availableLanguage: ["en", "sw"],
              },
            }),
          }}
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable}`}>
        <Navbar />
        {children}
        <SocialProof />
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
