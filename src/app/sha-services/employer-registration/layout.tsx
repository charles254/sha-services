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
            "datePublished": "2025-01-15",
            "dateModified": "2026-04-10",
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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shacyberservices.com" },
              { "@type": "ListItem", "position": 2, "name": "SHA Services", "item": "https://shacyberservices.com/#services" },
              { "@type": "ListItem", "position": 3, "name": "Employer Registration", "item": "https://shacyberservices.com/sha-services/employer-registration" }
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
              { q: 'Is SHA employer registration mandatory in Kenya?', a: 'Yes. Under the Social Health Insurance Act 2023, all employers in Kenya are legally required to register with SHA and make monthly contributions on behalf of their employees. Non-compliance can result in penalties.' },
              { q: 'What documents are required for employer registration?', a: 'You need your business registration certificate (CR12 for companies, or business name certificate), KRA PIN certificate, and the director\'s or owner\'s National ID.' },
              { q: 'How do I set up SHA payroll deductions after registration?', a: 'Once registered, you receive an SHA employer code which you integrate into your payroll system. Most payroll software in Kenya supports SHA deductions natively.' },
              { q: 'What are the monthly SHA contribution rates for employers?', a: 'SHA contribution rates are set by the Social Health Insurance Act and are based on a percentage of each employee\'s gross salary. Our agents provide current rate schedules with your employer code.' },
              { q: 'Can I register a new business that has not yet hired employees?', a: 'Yes. You can register your business with SHA in advance of hiring employees. This ensures you are compliant from day one when you begin employing staff.' },
              { q: 'What happens if I miss SHA contribution deadlines?', a: 'Late SHA contributions incur penalties as stipulated by the Social Health Insurance Act. Persistent non-compliance may result in your employees losing access to SHA-covered health services.' },
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
            "name": "How to Register as an SHA Employer Online",
            "description": "Register your business as an SHA employer and get your employer code in 48 hours.",
            "totalTime": "PT48H",
            "estimatedCost": { "@type": "MonetaryAmount", "currency": "KES", "value": "800" },
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Visit the website", "text": "Go to shacyberservices.com to access our online SHA services portal." },
              { "@type": "HowToStep", "position": 2, "name": "Select Employer Registration", "text": "Choose the Employer Registration service from the available SHA services." },
              { "@type": "HowToStep", "position": 3, "name": "Submit company details", "text": "Provide your business registration certificate, KRA PIN certificate, and director's National ID." },
              { "@type": "HowToStep", "position": 4, "name": "Pay KES 800 via M-Pesa", "text": "Complete the payment of KES 800 using M-Pesa to process your employer registration." },
              { "@type": "HowToStep", "position": 5, "name": "Receive registration certificate", "text": "Your SHA employer code and registration certificate will be delivered within 48 hours." }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
