import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window);

export const sanitize = (text: string): string => {
  return purify.sanitize(text, { ALLOWED_TAGS: [] });
};

