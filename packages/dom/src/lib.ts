import { format, type WongojiConfig } from '@wongoji/core';
import styles from './style.module.css';

console.log(styles);

export function render(element: HTMLElement, text: string, options: WongojiConfig = {}) {
  const formatted = format(text, options);

  while (formatted.length > 0) {
    const page = document.createElement('div');
    page.className = `page ${styles.page}`;

    element.appendChild(page);
    formatted.splice(0, 4);
  }

  console.log(formatted);
}
