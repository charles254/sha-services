import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA Contribution Statement | Download in 1hr',
  description: 'Get your official SHA contribution statement delivered to your email in 1 hour. Perfect for loans, visas, and employment verification. Only Ksh 200 via M-Pesa.',
  keywords: ['SHA statement', 'NHIF contribution history', 'download SHA records', 'Social Health Authority payment statement'],
  alternates: { canonical: '/sha-services/contribution-statement' },
  openGraph: {
    title: 'SHA Contribution Statement | Ready in 1 Hour',
    description: 'Download your official SHA contribution history for loans, visas, or records. Delivered to your email in 1 hour.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA Contribution Statement | Ready in 1 Hour',
    description: 'Download your official SHA contribution history for loans, visas, or records. Delivered to your email in 1 hour.',
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
            "name": "SHA Contribution Statement",
            "description": "Get your official Social Health Authority (SHA) contribution history and payment records delivered to your email.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Document Request",
            "offers": {
              "@type": "Offer",
              "price": "200",
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
              { "@type": "ListItem", "position": 3, "name": "Contribution Statement", "item": "https://shaservices.co.ke/sha-services/contribution-statement" }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
