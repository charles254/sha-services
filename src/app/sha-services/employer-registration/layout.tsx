import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA Employer Registration | Ksh 800, 48hrs',
  description: 'Register your business as an SHA employer in 48 hours. Get your employer code and payroll setup — certified agents handle everything. Ksh 800 via M-Pesa.',
  keywords: ['SHA employer registration', 'corporate NHIF registration', 'SHA business portal', 'Social Health Authority employer onboarding'],
  alternates: { canonical: '/sha-services/employer-registration' },
  openGraph: {
    title: 'SHA Employer Registration Online | 48hr Processing',
    description: 'Register your business as an SHA employer. Get employer code and payroll setup in 48 hours. No office visits.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA Employer Registration Online | 48hr Processing',
    description: 'Register your business as an SHA employer. Get employer code and payroll setup in 48 hours.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SHA Employer Registration",
            "description": "Register your business as a Social Health Authority (SHA) employer for mandatory staff health coverage.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Business Registration",
            "offers": {
              "@type": "Offer",
              "price": "800",
              "priceCurrency": "KES"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shaservices.co.ke" },
              { "@type": "ListItem", "position": 2, "name": "SHA Services", "item": "https://shaservices.co.ke/#services" },
              { "@type": "ListItem", "position": 3, "name": "Employer Registration", "item": "https://shaservices.co.ke/sha-services/employer-registration" }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
