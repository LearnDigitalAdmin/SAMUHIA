import { site, founder, products, features, abs } from '../lib/data.js';

const ORG_ID = () => abs('/#org');
const SITE_ID = () => abs('/#website');
const FOUNDER_ID = () => abs('/founder/#person');

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID(),
  name: site.legalName,
  alternateName: site.name,
  url: abs('/'),
  logo: { '@type': 'ImageObject', url: abs('/assets/icons/icon-512.png'), width: 512, height: 512 },
  image: abs(site.ogImage),
  description: site.description,
  slogan: site.tagline,
  foundingDate: String(site.foundingYear),
  foundingLocation: { '@type': 'Country', name: site.countryName },
  founder: { '@id': FOUNDER_ID() },
  email: site.email,
  telephone: site.phone,
  address: { '@type': 'PostalAddress', addressCountry: site.countryCode },
  areaServed: { '@type': 'Country', name: site.countryName },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: site.email, telephone: site.phone, areaServed: site.countryCode, availableLanguage: ['English', 'Swahili'] }],
  knowsAbout: ['Property management software', 'School attendance software', 'Chama and group savings management', 'Mobile money payments', 'Digital services for small businesses', 'Landlord rent reporting for agent-managed properties', 'Rental listings and vacant unit search on WhatsApp'],
  ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
});

export const person = () => ({
  '@type': 'Person',
  '@id': FOUNDER_ID(),
  name: founder.name,
  jobTitle: founder.jobTitle,
  url: abs('/founder/'),
  worksFor: { '@id': ORG_ID() },
  ...(founder.image ? { image: abs(founder.image) } : {}),
  ...(Object.values(founder.links).filter(Boolean).length ? { sameAs: Object.values(founder.links).filter(Boolean) } : {}),
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID(),
  name: site.name,
  url: abs('/'),
  inLanguage: 'en-KE',
  publisher: { '@id': ORG_ID() },
});

export const webPage = ({ path, title, description, type = 'WebPage', extra = {} }) => ({
  '@type': type,
  '@id': abs(path) + '#webpage',
  url: abs(path),
  name: title,
  description,
  inLanguage: 'en-KE',
  isPartOf: { '@id': SITE_ID() },
  about: { '@id': ORG_ID() },
  ...extra,
});

export const breadcrumbList = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ label: 'Home', href: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.label,
    ...(it.href ? { item: abs(it.href) } : {}),
  })),
});

export const faqPage = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const numeric = (price) => {
  if (/^free$/i.test(price)) return 0;
  const m = price.match(/^KES\s*([\d,]+(?:\.\d+)?)$/i);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

const offersFor = (p) =>
  p.plans
    .filter((pl) => ['', '/ month', 'forever'].includes(pl.per) && numeric(pl.price) !== null)
    .map((pl) => ({
      '@type': 'Offer',
      name: pl.name,
      description: pl.description,
      price: String(numeric(pl.price)),
      priceCurrency: 'KES',
      url: abs(`/products/${p.slug}/`) + '#pricing',
      ...(pl.per === '/ month' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: numeric(pl.price), priceCurrency: 'KES', unitText: 'MONTH' } } : {}),
    }));

export const softwareApplication = (p) => {
  const offers = offersFor(p);
  return {
    '@type': 'SoftwareApplication',
    '@id': abs(`/products/${p.slug}/`) + '#app',
    name: p.name,
    description: p.longDescription,
    url: abs(`/products/${p.slug}/`),
    installUrl: p.appUrl,
    applicationCategory: p.schemaCategory,
    operatingSystem: p.operatingSystem,
    audience: { '@type': 'Audience', audienceType: p.audience },
    featureList: p.features,
    inLanguage: 'en-KE',
    countriesSupported: site.countryCode,
    image: abs(`/assets/brand/${p.slug}-icon.svg`),
    publisher: { '@id': ORG_ID() },
    ...(offers.length ? { offers } : {}),
  };
};

export const productItemList = () => ({
  '@type': 'ItemList',
  name: 'SAMUHIA products',
  itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}/`), name: p.name })),
});

/** A named feature of a product (Landlord Watch, House to Rent), described as a Service tied to its product's SoftwareApplication. */
export const featureService = (f) => ({
  '@type': 'Service',
  '@id': abs(`/features/${f.slug}/`) + '#service',
  name: f.name,
  serviceType: f.serviceType,
  description: f.description,
  url: abs(`/features/${f.slug}/`),
  provider: { '@id': ORG_ID() },
  areaServed: { '@type': 'Country', name: site.countryName },
  audience: { '@type': 'Audience', audienceType: f.audience },
  availableChannel: f.channels.map((c) => ({ '@type': 'ServiceChannel', name: c, availableLanguage: ['English', 'Swahili'] })),
  isRelatedTo: { '@id': abs(`/products/${f.product}/`) + '#app' },
});

export const featureItemList = () => ({
  '@type': 'ItemList',
  name: 'SAMUHIA features',
  itemListElement: features.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/features/${f.slug}/`), name: f.name })),
});
