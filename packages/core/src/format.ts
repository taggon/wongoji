import { parse, type Quote, type SingleQuote } from './parse';
import type { WongojiConfig } from './config';

const WONGOJI_WIDTH = 20;

/**
 * 주어진 원고지 형식에 맞추어 텍스트를 이차원 배열로 반환한다.
 * 1단계 배열은 원고지 한 줄을 의미하고, 2단계 배열은 줄의 한 칸을 의미한다.
 * @param text
 * @param config
 * @returns
 */
export function format(text: string, config: WongojiConfig = {}): string[][] {
  const doc = parse(text);

  return doc.nodes.reduce((lines, { type, nodes }) => {
    let currentLine: string[] = [];

    // 일단 새 줄을 추가하고 시작
    lines.push(currentLine);

    // 새 문단이나 인용문을 시작할 때는 한 칸 비우고 시작한다.
    currentLine.push(' ');

    for (const node of nodes) {
      switch (node.type) {
        case 'fulltext':
          let text = node.raw;
          while (currentLine.length + text.length > WONGOJI_WIDTH) {
            const first = text.slice(0, WONGOJI_WIDTH - currentLine.length);
            text = text.slice(WONGOJI_WIDTH - currentLine.length);
            currentLine.push(...first.split(''));
            lines.push(currentLine = []);
          }
          currentLine.push(...text.split(''));
          break;
        case 'halftext':
          for (let i=0; i < node.raw.length; i+=2) {
            const ch = node.raw.slice(i, i + 2);
            currentLine.push(ch);

            if (currentLine.length === WONGOJI_WIDTH) {
              lines.push(currentLine = []);
            }
          }
          break;
        case 'space':
          if (currentLine.length > 0) {
            currentLine.push(' ');
          }
          break;
        case 'punctuation':
          if (currentLine.length === 0 && lines.length > 1) {
            const secondLastLine = lines[lines.length - 2];
            const lastText = secondLastLine.pop();
            secondLastLine.push(...currentLine);
          } else {
            currentLine.push(node.raw);
          }
          break;
      }

      if (currentLine.length === 20) {
        lines.push(currentLine = []);
      }
    }

    return lines;
  }, [] as string[][]);;
}
