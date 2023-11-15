import { parse } from './parse';
import type { Node, ParentNode, Quote, SingleQuote } from './parse';
import type { WongojiConfig } from './config';

/**
 * 원고지 한 줄의 칸 수
 */
const WONGOJI_ROW_SIZE = 20;

/**
 * 따옴표 기호
 */
const QUOTE_SYMBOLS = `""\u201c\u201d''\u2018\u2019`;

/**
 * 주어진 원고지 형식에 맞추어 텍스트를 이차원 배열로 반환한다.
 * 1단계 배열은 원고지 한 줄을 의미하고, 2단계 배열은 줄의 한 칸을 의미한다.
 * @param text
 * @param config
 * @returns
 */
export function format(text: string, config: WongojiConfig = {}): string[][] {
  const doc = parse(text);
  const lines: string[][] = [[]];

  const walker = (node: Node, parent: ParentNode) => {
    if (lines[lines.length - 1].length === WONGOJI_ROW_SIZE) {
      lines.push([]);
    }

    // current line
    let cur = lines[lines.length - 1];
    const len = cur.length;

    switch (node.type) {
      case 'paragraph':
        // 문단은 새 줄에서 한 칸 비우고 시작한다.
        if (cur.length === 0) {
          cur.push(' ');
        } else {
          lines.push([' ']);
          cur = lines[lines.length - 1];
        }
        node.nodes.forEach((child) => walker(child, node));
        break;
      case 'quote':
      case 'singlequote':
        const symbolIndex = (node.type === 'quote' ? 0 : 4) + (config.useSmartQuote ? 2 : 0);

        if (needNewLine(node, config)) {
          // 이미 공백이 하나 있으면 그대로 쓰자.
          if (cur.length === 1 && cur[0] === ' ') {
            cur.pop();
          }

          if (cur.length > 0) {
            lines.push([' ']);
            cur = lines[lines.length - 1];
          } else {
            cur.push(' ');
          }
        }

        // 여는 (작은)따옴표
        cur.push(QUOTE_SYMBOLS[symbolIndex]);

        node.nodes.forEach((child) => walker(child, node));

        cur = lines[lines.length - 1];

        // 닫는 따옴표 앞의 공백은 제거한다.
        if (cur[cur.length - 1] === ' ') {
          cur.pop();
          cur = lines[lines.length - 1];
        }

        // 닫는 (작은)따옴표
        if (cur[cur.length - 1] === '.') {
          // 앞에 온점이 있으면 같은 칸에 표시한다.
          cur.pop();
          cur.push(`.${QUOTE_SYMBOLS[symbolIndex + 1]}`);
        } else {
          cur.push(QUOTE_SYMBOLS[symbolIndex + 1]);
        }

        if (needNewLine(node, config)) {
          lines.push([]);
        }
        break;
      case 'space':
        if (cur.length > 0) {
          cur.push(' ');
        }
        break;
      case 'fulltext':
        {
          let text = node.raw;
          for (let i = 0; i < text.length; i++) {
            cur.push(text[i]);
            if (cur.length === WONGOJI_ROW_SIZE) {
              lines.push([]);
              cur = lines[lines.length - 1];

              if ((parent.type === 'quote' || parent.type === 'singlequote') && needNewLine(parent, config)) {
                cur.push(' ');
              }
            }
          }
        }
        break;
      case 'halftext':
        {
          let text = node.raw;
          for (let i = 0; i < text.length; i+=2) {
            cur.push(text.slice(i, i + 2));
            if (cur.length === WONGOJI_ROW_SIZE) {
              lines.push([]);
              cur = lines[lines.length - 1];

              if ((parent.type === 'quote' || parent.type === 'singlequote') && needNewLine(parent, config)) {
                cur.push(' ');
              }
            }
          }
        }
        break;
      case 'punctuation':
        // 온점이나 반점인데 줄 시작이면 앞 글자에 붙인다.
        if (['.', ','].includes(node.raw) && len === 0) {
          lines.pop();
          const lastLine = lines[lines.length - 1];
          lastLine[lastLine.length - 1] += node.raw;
        } else {
          // 그 외에는 그대로 추가한다.
          cur.push(node.raw);
        }

        // 느낌표나 물음표이고 이어질 형제 노드가 있다면 공백을 추가한다.
        if (['!', '?'].includes(node.raw)) {
          if (parent.type !== 'document' && parent.nodes.indexOf(node) < parent.nodes.length - 1) {
            walker({ type: 'space' }, parent);
          }
        }
        break;
    }
  };

  doc.nodes.forEach((node) => walker(node, doc));

  if (lines[lines.length - 1].length === 0) {
    lines.pop();
  }

  return lines;
}

function needNewLine(node: Quote | SingleQuote, config: WongojiConfig) {
  if (!node.inline) return true;
  if (config.alwaysNewLineWithQuote && node.type === 'quote') return true;
  return false;
}
