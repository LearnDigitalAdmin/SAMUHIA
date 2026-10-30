import { esc } from '../lib/html.js';
import { bot, botLink } from '../lib/data.js';

/** A link button that opens the SAMUHIA WhatsApp bot (optionally with a prefilled first message). */
export const botButton = (label = bot.cta, { text, cls = 'btn pri' } = {}) =>
  `<a class="${esc(cls)}" href="${esc(botLink(text ?? bot.prefill))}" rel="noopener">${esc(label)}</a>`;

/** A callout band: heading, one sentence, the number, and a button. */
export const botCallout = ({ id = 'whatsapp-bot', title = 'Chat with SAMUHIA on WhatsApp', text, text2 = '' }) =>
  `<section aria-labelledby="${esc(id)}"><div class="bot-callout"><div><h2 id="${esc(id)}">${esc(title)}</h2><p>${esc(text)}</p>${text2 ? `<p>${esc(text2)}</p>` : ''}<p class="bot-num">${esc(bot.name)}: <a href="${esc(bot.url)}" rel="noopener">${esc(bot.phoneSpaced)}</a></p></div>${botButton()}</div></section>`;
