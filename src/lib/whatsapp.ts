// Import nomeado: o bundler só inclui este campo no script do cliente.
import { whatsapp } from '../content/site.json';

/** Mensagem genérica (usada no href de fallback, sem JS). */
export const DEFAULT_MESSAGE = 'Olá Nelson! Gostaria de saber mais sobre o acompanhamento.';

/**
 * Constrói a mensagem pré-preenchida do WhatsApp.
 * Mantém o formato do site anterior: nome + programa/plano de interesse.
 */
export function buildMessage(name: string, interest?: string): string {
  const lines = ['Olá, Nelson!', ''];
  lines.push(
    name
      ? `O meu nome é ${name} e gostaria de ter a orientação de um profissional para atingir os meus objetivos.`
      : 'Gostaria de ter a orientação de um profissional para atingir os meus objetivos.',
  );
  if (interest) lines.push('', `Tenho interesse no ${interest}.`);
  lines.push('', 'Como posso começar?', '', 'Obrigado!');
  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
