import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA PIN Registration Online | New Member Registration',
  description: 'Register as a new Social Health Authority (SHA) member online. Get your SHA PIN and member number quickly through our certified registration agents.',
  keywords: ['SHA registration', 'NHIF registration online', 'SHA PIN online', 'register for Social Health Authority'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
