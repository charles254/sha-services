import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | 404',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center mesh-bg grainy">
      <div className="text-center px-6">
        <h1 className="text-8xl font-black text-sha-600 mb-4">404</h1>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
