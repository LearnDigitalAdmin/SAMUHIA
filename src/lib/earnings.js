// Desk agent earning estimates. Every figure on the careers pages is computed here from
//   (1) the plan prices in src/content/products/*.json and
//   (2) the assumptions in src/content/careers.json  (mirrors the Desk commission rules).
// Amounts are whole Kenya shillings, rounded DOWN so estimates are never inflated.
import { careers, productBySlug } from './data.js';

const A = () => careers.assumptions;
const floor = (n) => Math.floor(n + 1e-9);

/** "KES 1,199" -> 1199 ; "Free" / "KES 0" -> 0 ; anything else -> null */
export const parseKes = (s = '') => {
  if (/^free$/i.test(s)) return 0;
  const m = String(s).match(/^KES\s*([\d,]+(?:\.\d+)?)$/i);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

export const kes = (n) => 'KES ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const kesDec = (n) => 'KES ' + n.toFixed(2);

/** Subscription or report: rank % of the amount left after the payment fee. */
export const subscriptionShare = (priceKes, rank) => floor(((priceKes * (100 - A().paystackFeePct)) / 100) * (A().rankSharePct[rank] / 100));

/** Desk service charged to a customer: agent keeps (100 - platform cut)% after the payment fee. */
export const serviceNet = (priceKes) => floor(((priceKes * (100 - A().paystackFeePct)) / 100) * ((100 - A().platformCutPct) / 100));

/** SMS top-up: share of margin (gross - fee - SMS cost). `first` = 100% of margin on a school/landlord's first small top-up. */
export const smsShare = (grossKes, ratePerPart, { first = false } = {}) => {
  const credits = Math.floor(grossKes / ratePerPart);
  const margin = grossKes - (grossKes * A().paystackFeePct) / 100 - credits * A().smsCostPerPartKes;
  if (margin <= 0) return 0;
  return floor(margin * (first ? 1 : A().smsSharePct / 100));
};

export const manualEntryPrice = (records) => {
  const t = A().manualEntryTiers.find((x) => records <= x.upTo) ?? A().manualEntryTiers.at(-1);
  return Math.min(t.priceKes, A().manualEntryCapKes) + A().manualEntryServiceFeeKes;
};

export const rentMax = () => floor((A().rentTakeCapKes * A().rentDeskSharePct) / 100);

/** Paid plans of a product with Clerk / Senior earnings per account per month. */
export const planEarnings = (slug) =>
  productBySlug(slug)
    .plans.map((pl) => ({ name: pl.name, price: parseKes(pl.price), per: pl.per }))
    .filter((pl) => pl.per === '/ month' && pl.price > 0)
    .map((pl) => ({ ...pl, clerk: subscriptionShare(pl.price, 'clerk'), senior: subscriptionShare(pl.price, 'senior') }));

const planByName = (slug, name) => {
  const p = planEarnings(slug).find((x) => x.name === name);
  if (!p) throw new Error(`careers.json: plan "${name}" not found on ${slug}`);
  return p;
};

/** One scenario line -> { label, amount }. Kinds mirror the earning streams. */
export const scenarioLine = (line, rank) => {
  switch (line.kind) {
    case 'subscription': {
      const p = planByName(line.product, line.plan);
      return { label: `${line.count} ${productBySlug(line.product).name} ${line.plan} ${line.count === 1 ? 'account' : 'accounts'}`, amount: p[rank] * line.count };
    }
    case 'import':
      return { label: `${line.count} Excel ${line.count === 1 ? 'import' : 'imports'}`, amount: serviceNet(A().importPriceKes) * line.count };
    case 'sms':
      return { label: `${line.count} SMS top-up${line.count === 1 ? '' : 's'} of ${kes(line.topUpKes)}`, amount: smsShare(line.topUpKes, line.rate) * line.count };
    case 'bonus':
      return { label: 'Milestone bonus, once per 10 retained paying accounts', amount: A().milestone.bonusKes * line.blocks };
    default:
      throw new Error(`Unknown scenario line kind: ${line.kind}`);
  }
};

export const scenario = (sc) => {
  const lines = sc.lines.map((l) => scenarioLine(l, sc.rank));
  return { ...sc, computed: lines, total: lines.reduce((s, l) => s + l.amount, 0) };
};

/** Headline numbers used in copy via {{tokens}}. */
export const tokens = () => {
  const chama = planEarnings('mychama');
  const pms = planEarnings('plot-yangu');
  const rates = A().smsRatesPerPart;
  const topUp = A().smsExampleTopUpKes;
  const smsAmounts = rates.map((r) => smsShare(topUp, r));
  const svcPrices = [A().schedulePriceKes, A().importPriceKes, manualEntryPrice(1), manualEntryPrice(100), manualEntryPrice(1_000_000)];
  return {
    clerkPct: A().rankSharePct.clerk,
    seniorPct: A().rankSharePct.senior,
    leadPct: A().rankSharePct.lead,
    cutPct: A().platformCutPct,
    keepPct: 100 - A().platformCutPct,
    feePct: A().paystackFeePct,
    importPrice: kes(A().importPriceKes),
    importNet: kes(serviceNet(A().importPriceKes)),
    svcMinPrice: kes(Math.min(...svcPrices)),
    svcMaxPrice: kes(Math.max(...svcPrices)),
    svcMinNet: kes(serviceNet(Math.min(...svcPrices))),
    svcMaxNet: kes(serviceNet(Math.max(...svcPrices))),
    schedulePrice: kes(A().schedulePriceKes),
    chamaMinClerk: kes(Math.min(...chama.map((p) => p.clerk))),
    chamaMaxSenior: kes(Math.max(...chama.map((p) => p.senior))),
    pmsMinClerk: kes(Math.min(...pms.map((p) => p.clerk))),
    pmsMaxSenior: kes(Math.max(...pms.map((p) => p.senior))),
    smsSharePct: A().smsSharePct,
    smsTopUp: kes(topUp),
    smsMin: kes(Math.min(...smsAmounts)),
    smsMax: kes(Math.max(...smsAmounts)),
    firstTopUp: kes(A().firstPurchaseExampleKes),
    firstTopUpShare: kes(smsShare(A().firstPurchaseExampleKes, A().firstPurchaseExampleRate, { first: true })),
    firstThreshold: kes(A().firstPurchaseThresholdKes),
    rentMax: kes(rentMax()),
    rentCap: kes(A().rentTakeCapKes),
    rentDeskPct: A().rentDeskSharePct,
    bonus: kes(A().milestone.bonusKes),
    bonusBlock: A().milestone.blockSize,
    bonusCap: kes(A().milestone.lifetimeCapKes),
    bonusMonths: A().milestone.minPaidMonths,
  };
};

let cache;
/** Replace {{token}} placeholders; unknown tokens fail the build (no silent blanks). */
export const fill = (str) => {
  const t = (cache ??= tokens());
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in t)) throw new Error(`careers.json: unknown token {{${k}}}`);
    return t[k];
  });
};
