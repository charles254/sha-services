import { MetadataRoute } from 'next';
import { KENYAN_LOCATIONS } from '@/lib/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shaservices.co.ke';

  const services = [
    'change-phone',
    'pin-registration',
    'contribution-statement',
    'beneficiary-update',
    'employer-registration',
  ];

  const mainRoutes = [
    '',
    '/track',
    ...services.map((s) => `/sha-services/${s}`),
  ];

  const locationRoutes = KENYAN_LOCATIONS.map((l) => `/locations/${l.slug}`);

  const allRoutes = [...mainRoutes, ...locationRoutes];

  return allRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
