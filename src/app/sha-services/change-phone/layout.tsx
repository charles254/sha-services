import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change SHA Phone Number Online | Ksh 500, 24hrs',
  description: 'Update your SHA phone number online in 24 hours. Upload your National ID and Police Abstract — certified agents handle the rest. Ksh 500 via M-Pesa.',
  keywords: ['SHA phone change', 'NHIF phone number change', 'update SHA number online', 'Social Health Authority phone update'],
  alternates: { canonical: '/sha-services/change-phone' },
  openGraph: {
    title: 'Change SHA Phone Number Online | 24hr Processing',
    description: 'Update your SHA phone number without visiting an office. Upload docs, pay via M-Pesa, done in 24 hours.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Change SHA Phone Number Online | 24hr Processing',
    description: 'Update your SHA phone number without visiting an office. Upload docs, pay via M-Pesa, done in 24 hours.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
