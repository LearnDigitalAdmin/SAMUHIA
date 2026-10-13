// /llms.txt (llmstxt.org format) and /llms-full.txt
import { site, products, solutions, abs, productBySlug, careers } from '../lib/data.js';
import { homeMarkdown, aboutMarkdown, founderMarkdown, pricingMarkdown, careersMarkdown, careerPathMarkdown, productsIndexMarkdown, productMarkdown, solutionsIndexMarkdown, solutionMarkdown } from './markdown.js';

const md = (p) => abs(p + 'index.md');

export const llmsTxt = () => `# ${site.name}

> ${site.description}

${site.legalName} is based in ${site.countryName} and was founded in ${site.foundingYear}. Its products are: ${products.map((p) => p.name).join(', ')}. Samuhia Payments is the shared payment layer behind the other products. Prices are in Kenya shillings (KES); payments are made by M-Pesa. Contact: ${site.email}, ${site.phone}.

## Products

${products.map((p) => `- [${p.name}](${md(`/products/${p.slug}/`)}): ${p.description}`).join('\n')}

## Solutions

${solutions.map((s) => `- [${s.title}](${md(`/solutions/${s.slug}/`)}): ${s.description} Recommended: ${productBySlug(s.product).name}.`).join('\n')}

## Company

- [About ${site.name}](${md('/about/')}): Mission, vision, principles and journey.
- [Founder](${md('/founder/')}): Sam Muhia, Founder & CEO.
- [Pricing](${md('/pricing/')}): Plans and fees for every product, in KES.
- [Careers](${md('/careers/')}): Samuhia Desk agent programme, earning estimates in KES and open paths.
${careers.paths.map((p) => `  - [${p.name}](${md(`/careers/${p.slug}/`)})`).join('\n')}
- [Contact](${abs('/contact/')}): Email, phone, WhatsApp and contact form.

## Optional

- [Full site content in one file](${abs('/llms-full.txt')}): Every product, plan, feature and FAQ.
- [Sitemap](${abs('/sitemap.xml')}): All indexable pages.
`;

export const llmsFullTxt = () =>
  [
    `# ${site.name} — full site content\n\n> Generated from ${abs('/')}. Prices in KES.\n`,
    homeMarkdown(),
    productsIndexMarkdown(),
    ...products.map(productMarkdown),
    solutionsIndexMarkdown(),
    ...solutions.map(solutionMarkdown),
    pricingMarkdown(),
    aboutMarkdown(),
    founderMarkdown(),
    careersMarkdown(),
    ...careers.paths.map(careerPathMarkdown),
  ].join('\n\n---\n\n');
