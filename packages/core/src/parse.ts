import { tokenize, type Token } from './tokenize';
import type { WongojiConfig } from './config';

export type Document = {
  type: 'document';
  nodes: (Paragraph | Quote | SingleQuote)[];
};

export type Paragraph = {
  type: 'paragraph';
  nodes: (FullText | HalfText | Space | Punctuation | Quote | SingleQuote)[];
};

export type Quote = {
  type: 'quote';
  nodes: (FullText | HalfText | Space | Punctuation | SingleQuote)[];
  inline: boolean;
};

export type SingleQuote = {
  type: 'singlequote';
  nodes: (FullText | HalfText | Space | Punctuation)[];
  inline: boolean;
};

export type Space = {
  type: 'space';
};

export type FullText = {
  type: 'fulltext';
  raw: string;
};

export type HalfText = {
  type: 'halftext';
  raw: string;
};

export type Punctuation = {
  type: 'punctuation';
  raw: string;
};

export type ParentNode = Document | Paragraph | Quote | SingleQuote;

export type Node = ParentNode | Space | FullText | HalfText | Punctuation;

function eat(tokens: Token[], types: Token['type'][], start: number) {
  let i = start - 1;

  while (types.includes(tokens[++i]?.type));

  return i - 1;
}

function parseTokensIntoNodes(parent: ParentNode, tokens: Token[], from: number, to: number) {
  let i = from - 1;

  while(++i < tokens.length && i < to) {
    const tok = tokens[i];

    switch (tok.type) {
      case 'fulltext':
      case 'halftext':
      case 'punctuation':
        // 새 문단을 시작한다.
        if (parent.type === 'document') {
          const start = i;
          const endOfParagraph = tokens.findIndex((t, idx) => {
            return idx > i && t.type === 'newline';
          });
          i = endOfParagraph === -1 ? tokens.length : endOfParagraph;

          const paragraph: Paragraph = { type: 'paragraph', nodes: [] };
          parseTokensIntoNodes(paragraph, tokens, start, i);
          parent.nodes.push(paragraph);
          break;
        }

        parent.nodes.push({
          type: tok.type,
          raw: tok.raw,
        });

        // 문장 부호라면 뒤따른 공백을 무시한 다음...
        if (tok.type === 'punctuation') {
          i = eat(tokens, ['space'], i + 1);
        }
        break;
      case 'space':
        // 최상위 노드에는 공백이 허용되지 않는다.
        if (parent.type === 'document') continue;
        if (parent.nodes.length > 0) {
          // 바로 앞 노드가 인용문이라면 공백을 무시한다.
          const lastNode = parent.nodes[parent.nodes.length - 1];
          if (lastNode.type === 'quote' || lastNode.type === 'singlequote') {
            continue;
          }
          parent.nodes.push({ type: 'space' });
        }
        break;
      case 'newline':
        // 최상위 노드에는 줄바꿈이 허용되지 않는다.
        if (parent.type === 'document') continue;
        if (parent.nodes.length > 0) {
          parent.nodes.push({ type: 'space' });
        }
        break;
      case 'quote':
        // 닫는 따옴표의 인덱스를 찾는다.
        const start = i + 1;
        const closingQuoteIndex = tokens.findIndex((t, idx) => {
          return idx > i && t.type === 'quote' && t.raw === tok.raw;
        });
        i = closingQuoteIndex;

        if (closingQuoteIndex === -1) {
          // TODO: 닫는 따옴표를 찾지 못했을 때의 에러 처리
        } else {
          const quote: Quote | SingleQuote = { type: tok.raw === '"' ? 'quote' :  'singlequote', nodes: [], inline: parent.type != 'document' };
          parseTokensIntoNodes(quote, tokens, start, closingQuoteIndex);

          // 문단을 따옴표로 시작했지만, 보통 문단의 일부인 경우
          if (parent.type === 'document') {
            i = eat(tokens, ['space'], i + 1);
            if (['fulltext', 'halftext'].includes(tokens[i + 1]?.type)) {
              const paragraph: Paragraph = { type: 'paragraph', nodes: [quote] };
              parent.nodes.push(paragraph);

              // 뒤이어 나오는 문장을 같은 문단으로 처리한다.
              parent = paragraph;
              quote.inline = true;
              continue;
            }
          }

          if (parent.type === 'quote' || parent.type === 'singlequote') {
            // 따옴표가 중첩되는 경우가 아니면 여기를 탈 일이 없을텐데...
            break;
          }

          parent.nodes.push(quote);
        }
        break;
    }
  }
}

export function parse(text: string, config: WongojiConfig = {}): Document {
  if (config.replaceDotsWithEllipsis) {
    text = text.replace(/\.{3}/g, '…');
  }

  const tokens = tokenize(text);
  const doc: Document = { type: 'document', nodes: [] };

  parseTokensIntoNodes(doc, tokens, 0, tokens.length);

  return doc;
}
