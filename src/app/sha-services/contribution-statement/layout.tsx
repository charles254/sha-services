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
            "datePublished": "2025-01-15",
            "dateModified": "2026-04-10",
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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shacyberservices.com" },
              { "@type": "ListItem", "position": 2, "name": "SHA Services", "item": "https://shacyberservices.com/#services" },
              { "@type": "ListItem", "position": 3, "name": "Contribution Statement", "item": "https://shacyberservices.com/sha-services/contribution-statement" }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { q: 'What is an SHA contribution statement?', a: 'An SHA contribution statement is an official document showing your history of health insurance contributions to the Social Health Authority (formerly NHIF). It lists all payments made, including dates, amounts, and employer details where applicable. The document is stamped and authenticated by SHA.' },
              { q: 'Will my statement include old NHIF contributions?', a: 'Yes. Your SHA contribution statement includes historical records dating back to the NHIF era. When NHIF transitioned to SHA, all contribution records were migrated. Your statement will show your complete contribution history across both systems.' },
              { q: 'Is the contribution statement accepted by banks for loan applications?', a: 'Yes. SHA contribution statements are widely accepted by Kenyan banks and financial institutions as proof of employment and income stability. They are commonly required for mortgage applications, personal loans, and business financing.' },
              { q: 'Can I request a statement for a specific date range?', a: 'Yes. When submitting your request, you can specify a custom date range for your contribution history. If no dates are provided, you will receive a complete statement covering your entire contribution history.' },
              { q: 'How is the contribution statement delivered?', a: 'Your SHA contribution statement is delivered as an official PDF document directly to the email address you provide during the request. The PDF includes SHA authentication stamps and can be printed or forwarded digitally. Delivery takes approximately 1 hour.' },
              { q: 'What if my contribution records show missing payments?', a: 'If your statement reveals gaps in contributions, this may indicate periods where your employer did not remit payments or where voluntary contributions were missed. You can use the statement as evidence to follow up with your employer or SHA directly.' },
            ].map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a },
            })),
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Get Your SHA Contribution Statement Online",
            "description": "Download your official SHA contribution statement delivered to your email in 1 hour.",
            "totalTime": "PT1H",
            "estimatedCost": { "@type": "MonetaryAmount", "currency": "KES", "value": "200" },
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Visit the website", "text": "Go to shacyberservices.com to access our online SHA services portal." },
              { "@type": "HowToStep", "position": 2, "name": "Select Contribution Statement", "text": "Choose the Contribution Statement service from the available SHA services." },
              { "@type": "HowToStep", "position": 3, "name": "Pay KES 200 via M-Pesa", "text": "Complete the payment of KES 200 using M-Pesa to process your request." },
              { "@type": "HowToStep", "position": 4, "name": "Download your statement", "text": "Your official SHA contribution statement will be delivered to your email as a PDF within 1 hour." }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
