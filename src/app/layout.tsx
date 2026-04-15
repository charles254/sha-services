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
    url: "https://shacyberservices.com",
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
    site: "@shacyberke",
  },
  verification: {
    google: "F9kshl_Ly57IwOzG1oLS4Whh8bybSmGbP3GqlKske70",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q8YHC0RG12" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q8YHC0RG12');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SHA Online Cyber Services Kenya",
              url: "https://shacyberservices.com",
              logo: "https://shacyberservices.com/og-image.jpg",
              description: "Certified SHA agent services for Kenyan citizens.",
              areaServed: "KE",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254-719-628-275",
                contactType: "customer service",
                availableLanguage: ["en", "sw"],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "256",
                bestRating: "5",
              },
              review: [
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Wanjiku Muthoni" },
                  datePublished: "2025-11-15",
                  reviewBody: "Changed my SHA phone number in less than 24 hours. Very professional and the M-Pesa payment was seamless.",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Otieno Odhiambo" },
                  datePublished: "2025-12-03",
                  reviewBody: "Got my SHA PIN registration done in 2 hours. No queues, no stress. Highly recommended for anyone in Nairobi.",
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Amina Wambui" },
                  datePublished: "2026-01-20",
                  reviewBody: "Needed my contribution statement urgently for a bank loan. They delivered within an hour. Excellent service.",
                  reviewRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SHA Online Cyber Services",
              alternateName: ["SHA Cyber", "SHA Online Services"],
              url: "https://shacyberservices.com",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "SHA Online Cyber Services Kenya",
              image: "https://shacyberservices.com/og-image.jpg",
              url: "https://shacyberservices.com",
              telephone: "+254-719-628-275",
              priceRange: "KES 200-800",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Upper Hill",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi",
                postalCode: "00100",
                addressCountry: "KE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -1.2921,
                longitude: 36.8219,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "08:00",
                closes: "18:00",
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
