export type Token = {
  type: 'fulltext' | 'halftext' | 'space' | 'quote' | 'punctuation' | 'newline';
  raw: string;
};

export function tokenize(text: string) {
  const pattern = /([a-z0-9\u00df-\u00f6\u00f8-\u00ff]+)|( +)|(["'])|([,\.!?])|(\n+)|.+?/g;
  const tokens: Token[] = [];

  let match: RegExpExecArray | null = null;

  while (match = pattern.exec(text)) {
    // 소문자, 숫자
    if (match[1]) {
      tokens.push({ type: 'halftext', raw: match[1] });
      continue;
    }

    // 공백
    if (match[2]) {
      tokens.push({ type: 'space', raw: match[2] });
      continue;
    }

    // 따옴표
    if (match[3]) {
      tokens.push({ type: 'quote', raw: match[3] });
      continue;
    }

    // 구두점
    if (match[4]) {
      tokens.push({ type: 'punctuation', raw: match[4] });
      continue;
    }

    // 줄바꿈
    if (match[5]) {
      tokens.push({ type: 'newline', raw: match[5] });
      continue;
    }

    // 그 외에는 모두 한 칸을 차지하는 문자로 취급한다.
    const lastToken = tokens[tokens.length - 1];
    if (lastToken?.type === 'fulltext') {
      lastToken.raw += match[0];
    } else {
      tokens.push({ type: 'fulltext', raw: match[0] });
    }
  }

  return tokens;
}
