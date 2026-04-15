import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA PIN Registration Online | Ksh 300, 2hrs',
  description: 'Register as a new SHA member and get your PIN in 2 hours. Certified agents process your application — no queues, no office visits. Ksh 300 via M-Pesa.',
  keywords: ['SHA registration', 'NHIF registration online', 'SHA PIN online', 'register for Social Health Authority'],
  alternates: { canonical: '/sha-services/pin-registration' },
  openGraph: {
    title: 'SHA PIN Registration Online | 2hr Processing',
    description: 'Register as a new SHA member online. Get your PIN in 2 hours — no queues. Only Ksh 300.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA PIN Registration Online | 2hr Processing',
    description: 'Register as a new SHA member online. Get your PIN in 2 hours — no queues. Only Ksh 300.',
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
            "name": "SHA PIN Registration",
            "description": "Register as a new Social Health Authority (SHA) member and receive your unique member number online.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Registration",
            "datePublished": "2025-01-15",
            "dateModified": "2026-04-10",
            "offers": {
              "@type": "Offer",
              "price": "300",
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
              { "@type": "ListItem", "position": 3, "name": "PIN Registration", "item": "https://shacyberservices.com/sha-services/pin-registration" }
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
              { q: 'Who is eligible to register for a SHA PIN?', a: 'All Kenyan citizens and residents aged 18 and above are eligible to register as SHA members. This includes employed, self-employed, and unemployed individuals. Dependants (spouse, children under 25, and parents) can be added to an existing membership after registration.' },
              { q: 'What is the difference between SHA and NHIF?', a: 'SHA (Social Health Authority) replaced NHIF (National Hospital Insurance Fund) as part of Kenya\'s universal health coverage reforms under the Social Health Insurance Act 2023. If you were previously registered with NHIF, your records have been migrated to SHA. New members now register directly under SHA.' },
              { q: 'What documents do I need for SHA PIN registration?', a: 'You need a valid National ID card or Kenyan passport. The registration form also requires your date of birth, phone number, email address, and employment details. If you are employed, your employer\'s name and details are required for contribution purposes.' },
              { q: 'How long does it take to receive my SHA member number?', a: 'Through our platform, SHA PIN registration is processed within approximately 2 hours. You will receive your unique SHA member number via SMS and email. This is significantly faster than the in-person process at government offices, which can take several days.' },
              { q: 'Can I register my family members at the same time?', a: 'The initial registration creates your individual SHA membership. Once you have your member number, you can add dependants (spouse, children, and parents) through our Beneficiary Update service. This is a separate process with its own documentation requirements.' },
              { q: 'What happens after I get my SHA PIN?', a: 'Once registered, you can access SHA-covered health services at any accredited facility. Your employer (if employed) will begin making monthly contributions through payroll. Self-employed and informal sector workers can make voluntary contributions via M-Pesa.' },
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
            "name": "How to Register for a SHA PIN Online",
            "description": "Register as a new SHA member and get your PIN in 2 hours through our certified agent platform.",
            "totalTime": "PT2H",
            "estimatedCost": { "@type": "MonetaryAmount", "currency": "KES", "value": "300" },
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Visit the website", "text": "Go to shacyberservices.com to access our online SHA services portal." },
              { "@type": "HowToStep", "position": 2, "name": "Select PIN Registration", "text": "Choose the PIN Registration service from the available SHA services." },
              { "@type": "HowToStep", "position": 3, "name": "Pay KES 300 via M-Pesa", "text": "Complete the payment of KES 300 using M-Pesa to process your registration." },
              { "@type": "HowToStep", "position": 4, "name": "Receive your SHA PIN via email", "text": "Your SHA PIN and member number will be delivered to your email within 2 hours." }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
