import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA Employer Registration Online | Corporate Portal',
  description: 'Register your business as an SHA employer and comply with health authority regulations. Online assistance for employer code and staff onboarding.',
  keywords: ['SHA employer registration', 'corporate NHIF registration', 'SHA business portal', 'Social Health Authority employer onboarding'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
