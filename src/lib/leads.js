// Shared helpers for the Plot Yangu lead-capture page (used by the page builder and the Markdown twin).
import { site, bot, leads, productBySlug } from './data.js';

export const leadProduct = () => productBySlug(leads.product);

/** Google Forms embed URL (?embedded=true removes the form chrome). The plain URL is the new-tab fallback. */
export const formEmbedSrc = () => `${leads.formUrl}?embedded=true`;

/** Opens WhatsApp to the company number with a prefilled message. */
export const leadWhatsappUrl = () => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(leads.whatsappText)}`;

/** Facts that must stay identical to the product file are derived from it, not retyped. */
const tokens = () => {
  const p = leadProduct();
  const top = p.plans[p.plans.length - 1];
  const trial = p.facts.find((f) => f.label === 'Free trial')?.value;
  return {
    pricing: `Plot Yangu has plans from free to ${top.price} a month, paid by M-Pesa. Free trial: ${trial}.`,
    bot: bot.phoneSpaced,
    phone: site.phoneDisplay,
    email: site.email,
  };
};

const fill = (s) => {
  const t = tokens();
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in t)) throw new Error(`plot-yangu-leads.json: unknown token {{${k}}}`);
    return t[k];
  });
};

export const leadFaq = () => leads.faq.map((f) => ({ q: fill(f.q), a: fill(f.a) }));
