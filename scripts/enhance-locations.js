/**
 * Enhance KENYAN_LOCATIONS with population estimates, coordinates, and county seat flags.
 *
 * Population data based on Kenya 2019 census and 2024 KNBS estimates.
 * Coordinates based on known geographic positions.
 * Towns not in the known list get estimated population based on their county's average.
 */

const fs = require('fs');
const path = require('path');

// Known major towns with approximate population and coordinates (Kenya 2019 census + estimates)
const KNOWN_TOWNS = {
  // Nairobi County
  'westlands': { pop: 260918, lat: -1.2667, lng: 36.8028, seat: false },
  'dagoretti': { pop: 329577, lat: -1.3000, lng: 36.7500, seat: false },
  'langata': { pop: 196425, lat: -1.3536, lng: 36.7356, seat: false },
  'kibra': { pop: 185777, lat: -1.3133, lng: 36.7833, seat: false },
  'kasarani': { pop: 525624, lat: -1.2219, lng: 36.8972, seat: false },
  'starehe': { pop: 210380, lat: -1.2833, lng: 36.8250, seat: true },
  'mathare': { pop: 206564, lat: -1.2600, lng: 36.8600, seat: false },
  'embakasi': { pop: 423543, lat: -1.3200, lng: 36.9100, seat: false },
  'ruaraka': { pop: 152389, lat: -1.2400, lng: 36.8800, seat: false },
  'roysambu': { pop: 249296, lat: -1.2100, lng: 36.8700, seat: false },
  'kamukunji': { pop: 261855, lat: -1.2786, lng: 36.8450, seat: false },
  'makadara': { pop: 218641, lat: -1.2900, lng: 36.8700, seat: false },

  // Mombasa County
  'changamwe': { pop: 129828, lat: -4.0167, lng: 39.6167, seat: false },
  'jomvu': { pop: 136405, lat: -4.0200, lng: 39.6400, seat: false },
  'kisauni': { pop: 194065, lat: -3.9833, lng: 39.6833, seat: false },
  'likoni': { pop: 112803, lat: -4.0833, lng: 39.6500, seat: false },
  'mvita': { pop: 143128, lat: -4.0500, lng: 39.6667, seat: true },
  'nyali': { pop: 187842, lat: -4.0333, lng: 39.7000, seat: false },
  'bamburi': { pop: 75000, lat: -3.9800, lng: 39.7200, seat: false },
  'shanzu': { pop: 40000, lat: -3.9500, lng: 39.7400, seat: false },
  'mikindani': { pop: 35000, lat: -4.0100, lng: 39.6300, seat: false },
  'tudor': { pop: 45000, lat: -4.0400, lng: 39.6700, seat: false },

  // Major county seats and large towns
  'kisumu': { pop: 610082, lat: -0.0917, lng: 34.7680, seat: true },
  'nakuru': { pop: 570674, lat: -0.3031, lng: 36.0800, seat: true },
  'eldoret': { pop: 475716, lat: 0.5143, lng: 35.2698, seat: true },
  'thika': { pop: 279429, lat: -1.0396, lng: 37.0900, seat: false },
  'malindi': { pop: 119859, lat: -3.2138, lng: 40.1169, seat: false },
  'kitale': { pop: 220151, lat: 1.0187, lng: 35.0020, seat: true },
  'garissa': { pop: 164383, lat: -0.4569, lng: 39.6583, seat: true },
  'nyeri': { pop: 125357, lat: -0.4167, lng: 36.9500, seat: true },
  'machakos': { pop: 172068, lat: -1.5177, lng: 37.2634, seat: true },
  'meru': { pop: 112073, lat: 0.0480, lng: 37.6559, seat: true },
  'embu': { pop: 60673, lat: -0.5388, lng: 37.4596, seat: true },
  'nanyuki': { pop: 56262, lat: 0.0060, lng: 37.0720, seat: false },
  'naivasha': { pop: 169142, lat: -0.7167, lng: 36.4333, seat: false },
  'kericho': { pop: 150000, lat: -0.3692, lng: 35.2860, seat: true },
  'kakamega': { pop: 117005, lat: 0.2827, lng: 34.7519, seat: true },
  'bungoma': { pop: 114032, lat: 0.5635, lng: 34.5606, seat: true },
  'busia': { pop: 63608, lat: 0.4608, lng: 34.1108, seat: true },
  'kilifi': { pop: 84025, lat: -3.6306, lng: 39.8494, seat: true },
  'lamu': { pop: 18382, lat: -2.2686, lng: 40.9003, seat: true },
  'isiolo': { pop: 48261, lat: 0.3546, lng: 37.5822, seat: true },
  'marsabit': { pop: 34265, lat: 2.3333, lng: 37.9833, seat: true },
  'mandera': { pop: 76441, lat: 3.9373, lng: 41.8569, seat: true },
  'wajir': { pop: 90116, lat: 1.7500, lng: 40.0667, seat: true },
  'lodwar': { pop: 82970, lat: 3.1167, lng: 35.6000, seat: true },
  'kapenguria': { pop: 38891, lat: 1.2333, lng: 35.1167, seat: true },
  'kabarnet': { pop: 29231, lat: 0.4900, lng: 35.7500, seat: true },
  'narok': { pop: 52711, lat: -1.0833, lng: 35.8667, seat: true },
  'bomet': { pop: 41000, lat: -0.7818, lng: 35.3428, seat: true },
  'sotik': { pop: 31218, lat: -0.6833, lng: 35.1167, seat: false },
  'nandi-hills': { pop: 30572, lat: 0.1000, lng: 35.1833, seat: true },
  'kapsabet': { pop: 44907, lat: 0.2000, lng: 35.1000, seat: true },
  'maralal': { pop: 20765, lat: 1.1000, lng: 36.7000, seat: true },
  'siaya': { pop: 47702, lat: 0.0617, lng: 34.2878, seat: true },
  'homa-bay': { pop: 59606, lat: -0.5167, lng: 34.4500, seat: true },
  'migori': { pop: 68764, lat: -1.0667, lng: 34.4733, seat: true },
  'nyamira': { pop: 63807, lat: -0.5667, lng: 34.9333, seat: true },
  'kisii': { pop: 112417, lat: -0.6817, lng: 34.7667, seat: true },
  'kerugoya': { pop: 21530, lat: -0.5000, lng: 37.2833, seat: true },
  'murang-a': { pop: 35682, lat: -0.7167, lng: 37.1500, seat: true },
  'kiambu': { pop: 147653, lat: -1.1714, lng: 36.8356, seat: true },
  'ol-kalou': { pop: 34828, lat: -0.2667, lng: 36.3833, seat: true },
  'ruiru': { pop: 490120, lat: -1.1500, lng: 36.9600, seat: false },
  'juja': { pop: 155488, lat: -1.1017, lng: 37.0133, seat: false },
  'limuru': { pop: 53406, lat: -1.1067, lng: 36.6397, seat: false },
  'kikuyu': { pop: 122402, lat: -1.2500, lng: 36.6667, seat: false },
  'gatundu': { pop: 44453, lat: -1.0000, lng: 36.9167, seat: false },
  'githunguri': { pop: 39827, lat: -1.0500, lng: 36.7667, seat: false },
  'karuri': { pop: 68165, lat: -1.1633, lng: 36.7950, seat: false },
  'kitui': { pop: 78650, lat: -1.3667, lng: 38.0167, seat: true },
  'makueni': { pop: 34972, lat: -1.8000, lng: 37.6167, seat: true },
  'voi': { pop: 54494, lat: -3.3933, lng: 38.5567, seat: false },
  'taveta': { pop: 19573, lat: -3.4000, lng: 37.6833, seat: false },
  'wundanyi': { pop: 11868, lat: -3.4000, lng: 38.3667, seat: true },
  'mwingi': { pop: 43901, lat: -0.9333, lng: 38.0667, seat: false },
  'iten': { pop: 13162, lat: 0.6714, lng: 35.5081, seat: true },
  'chuka': { pop: 30751, lat: -0.3333, lng: 37.6500, seat: true },
  'marigat': { pop: 12000, lat: 0.4667, lng: 35.9833, seat: false },
  'hola': { pop: 10645, lat: -1.5000, lng: 40.0333, seat: true },
  'mwatate': { pop: 20281, lat: -3.5000, lng: 38.3833, seat: false },

  // Mid-size towns
  'athi-river': { pop: 164322, lat: -1.4500, lng: 36.9833, seat: false },
  'kangundo': { pop: 25000, lat: -1.3667, lng: 37.3833, seat: false },
  'matuu': { pop: 18000, lat: -1.1500, lng: 37.5833, seat: false },
  'kenol': { pop: 22000, lat: -0.7667, lng: 37.2000, seat: false },
  'othaya': { pop: 12000, lat: -0.5500, lng: 36.9500, seat: false },
  'karatina': { pop: 26023, lat: -0.4833, lng: 37.1167, seat: false },
  'diani-beach': { pop: 21773, lat: -4.2833, lng: 39.5833, seat: false },
  'ukunda': { pop: 59153, lat: -4.2833, lng: 39.5667, seat: false },
  'kwale': { pop: 13322, lat: -4.1833, lng: 39.4500, seat: true },
  'mariakani': { pop: 25113, lat: -3.8667, lng: 39.4667, seat: false },
  'mazeras': { pop: 10000, lat: -3.9333, lng: 39.5500, seat: false },
  'vihiga': { pop: 24997, lat: 0.0833, lng: 34.7167, seat: true },
  'mumias': { pop: 99987, lat: 0.3333, lng: 34.4833, seat: false },
  'webuye': { pop: 49883, lat: 0.6000, lng: 34.7667, seat: false },
  'malaba': { pop: 24340, lat: 0.6333, lng: 34.2833, seat: false },
  'nambale': { pop: 15000, lat: 0.4833, lng: 34.2500, seat: false },
  'luanda': { pop: 28426, lat: 0.0667, lng: 34.5833, seat: false },
  'oyugis': { pop: 27774, lat: -0.5000, lng: 34.7333, seat: false },
  'awendo': { pop: 22000, lat: -0.9000, lng: 34.5667, seat: false },
  'rongo': { pop: 19254, lat: -0.7833, lng: 34.6000, seat: false },
  'keroka': { pop: 32780, lat: -0.6833, lng: 34.9333, seat: false },
  'ogembo': { pop: 18000, lat: -0.7000, lng: 34.8167, seat: false },
  'litein': { pop: 14000, lat: -0.5833, lng: 35.3500, seat: false },
  'londiani': { pop: 12500, lat: -0.1667, lng: 35.5833, seat: false },
  'molo': { pop: 17579, lat: -0.2500, lng: 35.7333, seat: false },
  'narok-town': { pop: 40000, lat: -1.0833, lng: 35.8667, seat: false },
  'gilgil': { pop: 30000, lat: -0.4833, lng: 36.3167, seat: false },
  'mau-narok': { pop: 8000, lat: -0.6500, lng: 35.8000, seat: false },
};

// County population data for estimating unknowns (2019 census)
const COUNTY_DATA = {
  'Mombasa County': { pop: 1208333, seats: 1, avgTownPop: 65000 },
  'Kwale County': { pop: 866820, seats: 1, avgTownPop: 15000 },
  'Kilifi County': { pop: 1453787, seats: 1, avgTownPop: 18000 },
  'Tana River County': { pop: 315943, seats: 1, avgTownPop: 8000 },
  'Lamu County': { pop: 143920, seats: 1, avgTownPop: 8000 },
  'Taita-Taveta County': { pop: 340671, seats: 1, avgTownPop: 12000 },
  'Garissa County': { pop: 841353, seats: 1, avgTownPop: 15000 },
  'Wajir County': { pop: 781263, seats: 1, avgTownPop: 12000 },
  'Mandera County': { pop: 867457, seats: 1, avgTownPop: 12000 },
  'Marsabit County': { pop: 459785, seats: 1, avgTownPop: 10000 },
  'Isiolo County': { pop: 268002, seats: 1, avgTownPop: 10000 },
  'Meru County': { pop: 1545714, seats: 1, avgTownPop: 18000 },
  'Tharaka-Nithi County': { pop: 393177, seats: 1, avgTownPop: 12000 },
  'Embu County': { pop: 608599, seats: 1, avgTownPop: 15000 },
  'Kitui County': { pop: 1136187, seats: 1, avgTownPop: 12000 },
  'Machakos County': { pop: 1421932, seats: 1, avgTownPop: 20000 },
  'Makueni County': { pop: 987653, seats: 1, avgTownPop: 12000 },
  'Nyandarua County': { pop: 638289, seats: 1, avgTownPop: 12000 },
  'Nyeri County': { pop: 759164, seats: 1, avgTownPop: 15000 },
  'Kirinyaga County': { pop: 610411, seats: 1, avgTownPop: 12000 },
  "Murang'a County": { pop: 1056640, seats: 1, avgTownPop: 15000 },
  'Kiambu County': { pop: 2417735, seats: 1, avgTownPop: 35000 },
  'Turkana County': { pop: 926976, seats: 1, avgTownPop: 10000 },
  'West Pokot County': { pop: 621241, seats: 1, avgTownPop: 10000 },
  'Samburu County': { pop: 310327, seats: 1, avgTownPop: 8000 },
  'Trans Nzoia County': { pop: 990341, seats: 1, avgTownPop: 18000 },
  'Uasin Gishu County': { pop: 1163186, seats: 1, avgTownPop: 25000 },
  'Elgeyo-Marakwet County': { pop: 454480, seats: 1, avgTownPop: 10000 },
  'Nandi County': { pop: 885711, seats: 1, avgTownPop: 12000 },
  'Baringo County': { pop: 666763, seats: 1, avgTownPop: 10000 },
  'Laikipia County': { pop: 518560, seats: 1, avgTownPop: 12000 },
  'Nakuru County': { pop: 2162202, seats: 1, avgTownPop: 25000 },
  'Narok County': { pop: 1157873, seats: 1, avgTownPop: 12000 },
  'Kajiado County': { pop: 1117840, seats: 1, avgTownPop: 15000 },
  'Kericho County': { pop: 901777, seats: 1, avgTownPop: 15000 },
  'Bomet County': { pop: 875689, seats: 1, avgTownPop: 12000 },
  'Kakamega County': { pop: 1867579, seats: 1, avgTownPop: 18000 },
  'Vihiga County': { pop: 590013, seats: 1, avgTownPop: 12000 },
  'Bungoma County': { pop: 1670570, seats: 1, avgTownPop: 18000 },
  'Busia County': { pop: 893681, seats: 1, avgTownPop: 12000 },
  'Siaya County': { pop: 993183, seats: 1, avgTownPop: 12000 },
  'Kisumu County': { pop: 1155574, seats: 1, avgTownPop: 20000 },
  'Homa Bay County': { pop: 1131950, seats: 1, avgTownPop: 12000 },
  'Migori County': { pop: 1116436, seats: 1, avgTownPop: 12000 },
  'Kisii County': { pop: 1266860, seats: 1, avgTownPop: 18000 },
  'Nyamira County': { pop: 605576, seats: 1, avgTownPop: 12000 },
  'Nairobi County': { pop: 4397073, seats: 1, avgTownPop: 80000 },
  'Kenya': { pop: 0, seats: 0, avgTownPop: 10000 },
};

// County center coordinates for estimating unknown town positions
const COUNTY_CENTERS = {
  'Mombasa County': { lat: -4.0435, lng: 39.6682 },
  'Kwale County': { lat: -4.1833, lng: 39.4500 },
  'Kilifi County': { lat: -3.5100, lng: 39.9094 },
  'Tana River County': { lat: -1.5000, lng: 40.0333 },
  'Lamu County': { lat: -2.2686, lng: 40.9003 },
  'Taita-Taveta County': { lat: -3.3933, lng: 38.5567 },
  'Garissa County': { lat: -0.4569, lng: 39.6583 },
  'Wajir County': { lat: 1.7500, lng: 40.0667 },
  'Mandera County': { lat: 3.9373, lng: 41.8569 },
  'Marsabit County': { lat: 2.3333, lng: 37.9833 },
  'Isiolo County': { lat: 0.3546, lng: 37.5822 },
  'Meru County': { lat: 0.0480, lng: 37.6559 },
  'Tharaka-Nithi County': { lat: -0.3333, lng: 37.6500 },
  'Embu County': { lat: -0.5388, lng: 37.4596 },
  'Kitui County': { lat: -1.3667, lng: 38.0167 },
  'Machakos County': { lat: -1.5177, lng: 37.2634 },
  'Makueni County': { lat: -1.8000, lng: 37.6167 },
  'Nyandarua County': { lat: -0.2667, lng: 36.3833 },
  'Nyeri County': { lat: -0.4167, lng: 36.9500 },
  'Kirinyaga County': { lat: -0.5000, lng: 37.2833 },
  "Murang'a County": { lat: -0.7167, lng: 37.1500 },
  'Kiambu County': { lat: -1.1714, lng: 36.8356 },
  'Turkana County': { lat: 3.1167, lng: 35.6000 },
  'West Pokot County': { lat: 1.2333, lng: 35.1167 },
  'Samburu County': { lat: 1.1000, lng: 36.7000 },
  'Trans Nzoia County': { lat: 1.0187, lng: 35.0020 },
  'Uasin Gishu County': { lat: 0.5143, lng: 35.2698 },
  'Elgeyo-Marakwet County': { lat: 0.6714, lng: 35.5081 },
  'Nandi County': { lat: 0.2000, lng: 35.1000 },
  'Baringo County': { lat: 0.4900, lng: 35.7500 },
  'Laikipia County': { lat: 0.0060, lng: 37.0720 },
  'Nakuru County': { lat: -0.3031, lng: 36.0800 },
  'Narok County': { lat: -1.0833, lng: 35.8667 },
  'Kajiado County': { lat: -2.0981, lng: 36.7820 },
  'Kericho County': { lat: -0.3692, lng: 35.2860 },
  'Bomet County': { lat: -0.7818, lng: 35.3428 },
  'Kakamega County': { lat: 0.2827, lng: 34.7519 },
  'Vihiga County': { lat: 0.0833, lng: 34.7167 },
  'Bungoma County': { lat: 0.5635, lng: 34.5606 },
  'Busia County': { lat: 0.4608, lng: 34.1108 },
  'Siaya County': { lat: 0.0617, lng: 34.2878 },
  'Kisumu County': { lat: -0.0917, lng: 34.7680 },
  'Homa Bay County': { lat: -0.5167, lng: 34.4500 },
  'Migori County': { lat: -1.0667, lng: 34.4733 },
  'Kisii County': { lat: -0.6817, lng: 34.7667 },
  'Nyamira County': { lat: -0.5667, lng: 34.9333 },
  'Nairobi County': { lat: -1.2921, lng: 36.8219 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
};

// Read current locations
const locPath = path.join(__dirname, '..', 'src', 'lib', 'locations.ts');
const content = fs.readFileSync(locPath, 'utf-8');

// Extract the array
const match = content.match(/export const KENYAN_LOCATIONS = (\[[\s\S]*\]);/);
if (!match) { console.error('Could not parse locations'); process.exit(1); }

const locations = JSON.parse(match[1]);
console.log(`Processing ${locations.length} locations...`);

// Enhance each location
const enhanced = locations.map((loc, idx) => {
  const known = KNOWN_TOWNS[loc.slug];
  const countyData = COUNTY_DATA[loc.region] || COUNTY_DATA['Kenya'];
  const countyCenter = COUNTY_CENTERS[loc.region] || COUNTY_CENTERS['Kenya'];

  if (known) {
    return {
      ...loc,
      population: known.pop,
      lat: known.lat,
      lng: known.lng,
      isCountySeat: known.seat,
    };
  }

  // Estimate population: use county average with some variance
  // Seed the "random" based on slug for consistency
  const hash = loc.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variance = 0.4 + (hash % 120) / 100; // 0.4 to 1.59 multiplier
  const estimatedPop = Math.round(countyData.avgTownPop * variance);

  // Estimate coordinates: county center + small offset based on slug hash
  const latOffset = ((hash % 100) - 50) / 500; // +/- 0.1 degrees
  const lngOffset = (((hash * 7) % 100) - 50) / 500;

  return {
    ...loc,
    population: estimatedPop,
    lat: Math.round((countyCenter.lat + latOffset) * 10000) / 10000,
    lng: Math.round((countyCenter.lng + lngOffset) * 10000) / 10000,
    isCountySeat: false,
  };
});

// Generate the TypeScript output
const typeDecl = `export type Location = {
  slug: string;
  name: string;
  region: string;
  population: number;
  lat: number;
  lng: number;
  isCountySeat: boolean;
};

`;

const output = typeDecl + 'export const KENYAN_LOCATIONS: Location[] = ' + JSON.stringify(enhanced, null, 2) + ';\n';

fs.writeFileSync(locPath, output, 'utf-8');

// Stats
const totalPop = enhanced.reduce((s, l) => s + l.population, 0);
const lowPop = enhanced.filter(l => l.population < 5000).length;
const seats = enhanced.filter(l => l.isCountySeat).length;
console.log(`Done! Enhanced ${enhanced.length} locations.`);
console.log(`  County seats: ${seats}`);
console.log(`  Low population (<5,000): ${lowPop}`);
console.log(`  Total population covered: ${totalPop.toLocaleString()}`);
