import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update SHA Beneficiaries Online | Add Dependants',
  description: 'Add or update dependants on your SHA profile. Fast online processing for spouse and children beneficiary records with certified SHA agents.',
  keywords: ['SHA beneficiary update', 'add NHIF dependants', 'SHA member dependents', 'Social Health Authority beneficiary change'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
