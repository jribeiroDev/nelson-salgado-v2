// Import nomeado: o bundler só inclui este campo no script do cliente.
import { whatsapp } from '../content/site.json';

/**
 * Mensagem pré-preenchida do WhatsApp: curta, informal (como se escreve no WhatsApp)
 * e com o essencial para o Nelson responder logo — nome e programa/plano de interesse.
 */
export function buildMessage(name?: string, interest?: string): string {
  const intro = name ? `Chamo-me ${name} e gostava` : 'Gostava';
  const lines = ['Olá Nelson! 👋', `${intro} de começar a treinar contigo.`];
  if (interest) lines.push(`Tenho interesse no ${interest}.`, 'Podes explicar-me como funciona?');
  else lines.push('Podes explicar-me como funciona o acompanhamento?');
  return lines.join('\n');
}

/** Mensagem genérica (usada no href de fallback, sem JS). */
export const DEFAULT_MESSAGE = buildMessage();

export function buildWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
