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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://shacyberservices.com"),
  title: {
    default: "SHA Online Cyber Services | Fast, Certified & Secure",
    template: "%s | SHA Cyber Services",
  },
  description:
    "Skip the queues — certified agents handle your SHA services online. Phone change, PIN registration, statements & more. Pay via M-Pesa. Fast & secure.",
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
    siteName: "SHA Online Cyber Services Kenya",
    title: "SHA Online Cyber Services | Skip the Queues, Go Online",
    description:
      "Certified agents process your SHA requests online — phone updates, PIN registration, statements, beneficiary changes. 10,000+ requests handled. Pay via M-Pesa.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "SHA Online Cyber Services — Certified Agent Platform for Social Health Authority Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHA Online Cyber Services | Skip the Queues",
    description: "Certified agents handle your SHA services online. Phone change, PIN registration, statements & more. 10,000+ requests processed.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "F9kshl_Ly57IwOzG1oLS4Whh8bybSmGbP3GqlKske70",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
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
              name: "SHA Online Cyber Services Kenya",
              url: "https://shacyberservices.com",
              logo: "https://shacyberservices.com/logo.png",
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
