import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your SHA Request | Real-Time Status',
  description: 'Track your SHA request in real time. Enter your tracking ID to check status, view progress, and download documents. Instant SMS & email updates.',
  alternates: { canonical: '/track' },
  openGraph: {
    title: 'Track Your SHA Request | Real-Time Status',
    description: 'Check your SHA service request status instantly. Enter your tracking ID for real-time progress updates and document downloads.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Your SHA Request | Real-Time Status',
    description: 'Check your SHA service request status instantly. Enter your tracking ID for real-time progress updates.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
