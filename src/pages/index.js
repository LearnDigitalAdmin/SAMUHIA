// Registry of every page. To add a page: create a builder and add it to this list.
import { breadcrumbs } from '../components/breadcrumbs.js';
import { breadcrumbList } from '../seo/jsonld.js';
import { homePage } from './home.js';
import { allProductPages } from './products.js';
import { allSolutionPages } from './solutions.js';
import { allFeaturePages } from './features.js';
import { aboutPage, founderPage, securityPage } from './company.js';
import { allCareerPages } from './careers.js';
import { leadPage } from './leads.js';
import { pricingPage } from './pricing.js';
import { resourcesPage, supportPage, contactPage, notFoundPage } from './misc.js';
import { privacyPage, termsPage } from './legal.js';

export const allPages = () => {
  const pages = [
    homePage(),
    ...allProductPages(),
    leadPage(),
    ...allSolutionPages(),
    ...allFeaturePages(),
    pricingPage(),
    aboutPage(),
    founderPage(),
    securityPage(),
    ...allCareerPages(),
    resourcesPage(),
    supportPage(),
    contactPage(),
    privacyPage(),
    termsPage(),
    notFoundPage(),
  ];
  // Attach breadcrumbs (visible + JSON-LD) wherever a page declares them.
  return pages.map((p) => {
    if (!p.crumbs) return p;
    return { ...p, body: breadcrumbs(p.crumbs) + p.body, jsonld: [...p.jsonld, breadcrumbList(p.crumbs)] };
  });
};
