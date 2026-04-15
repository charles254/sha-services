import { MetadataRoute } from 'next';
import { KENYAN_LOCATIONS } from '@/lib/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shacyberservices.com';

  const services = [
    'change-phone',
    'pin-registration',
    'contribution-statement',
    'beneficiary-update',
    'employer-registration',
  ];

  const mainRoutes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '',          priority: 1.0, changeFrequency: 'weekly' },
    { path: '/contact',  priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about',    priority: 0.7, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy',  priority: 0.4, changeFrequency: 'monthly' },
    { path: '/terms',    priority: 0.4, changeFrequency: 'monthly' },
    { path: '/kdpa-compliance', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/locations', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/track',    priority: 0.6, changeFrequency: 'weekly' },
    ...services.map((s) => ({ path: `/sha-services/${s}`, priority: 0.9 as number, changeFrequency: 'weekly' as const })),
  ];

  // Only include locations with population >= 5,000 in sitemap (focus crawl budget)
  // County seats always included regardless of population
  const indexableLocations = KENYAN_LOCATIONS.filter((l) => l.population >= 5000 || l.isCountySeat);

  const locationRoutes = indexableLocations.map((l) => ({
    path: `/locations/${l.slug}`,
    // Higher priority for county seats and larger towns
    priority: l.isCountySeat ? 0.8 : l.population > 50000 ? 0.7 : 0.6,
    changeFrequency: 'monthly' as const,
  }));

  // County hub pages
  const countyRoutes = Array.from(new Set(KENYAN_LOCATIONS.map((l) => l.region)))
    .filter((r) => r !== 'Kenya')
    .map((region) => ({
      path: `/locations/county/${region.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    }));

  return [...mainRoutes, ...countyRoutes, ...locationRoutes].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
