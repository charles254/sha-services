import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download SHA Contribution Statement Online | NHIF History',
  description: 'Request and download your official SHA contribution statement and NHIF payment history. Real-time processing for individual and employer records.',
  keywords: ['SHA statement', 'NHIF contribution history', 'download SHA records', 'Social Health Authority payment statement'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
