export type CountOptions = {
};

// 숫자와 소문자는 반 칸을 차지한다.
function isHalfWidth(ch: string) {
  return ch.match(/[0-9a-z\u00DF-\u00F6\u00F8-\u00FF]/);
}

function normalize(text: string) {
  return text
    // 여러 번 줄 바꿈해도 하나로
    .replace(/[\r\n]+/g, '\n')
    // 공백 여러 개도 하나로
    .replace(/\s+/g, ' ')
    // 점 세 개는 줄임표로
    .replace(/\.\.\./g, '…')
    // 온점, 반점 뒤의 공백은 제거
    .replace(/([.,])\s/g, '$1');
}

export default function count(str: string, options: CountOptions = {}) {
  const text = normalize(str);
  const len = text.length;
  const context = {
    inQuote: false,
    inParagraph: false,
    lineOffset: 0,
  };
  const result = {
    pages: 1,
    squares: 0,
    lines: 1,
  };

  function incLine() {
    result.lines++;
    context.lineOffset = 0;
  }

  for (let i=0; i < len; i++) {
    const curr = text[i];
    const next = i + 1 < len ? text[i+1] : null;

    // 줄의 시작
    if (context.lineOffset === 0) {
      // 문단 내이면서 따옴표 안도 아닌데 첫 줄 시작이 빈 칸이라면 무시한다.
      if (curr === ' ' && context.inParagraph && !context.inQuote) {
        continue;
      }

      // 따옴표라면
      if (curr === '"') {
        // 한 칸 비우고, 시작해야 하니까 2칸을 더한다.
        result.squares += 2;
        context.lineOffset += 2;

        context.inQuote = true;

        continue;
      }

      // 문단을 시작하기 전이거나 따옴표 안이라면 한 칸 비우고 시작한다.
      if (!context.inParagraph || context.inQuote) {
        result.squares++;
        context.lineOffset++;
      }

      if (!context.inParagraph && !context.inQuote) {
        context.inParagraph = true;
      }
    }

    // 줄의 끝
    if (context.lineOffset === 19) {

      result.squares++;

      // 줄 끝인데 다음 문자가 마침표라면 붙여쓴다.
      if (next === '.') {
        i++;
        continue;
      }

      incLine();

      continue;
    }

    // 라틴 문자이거나 숫자가 연속하면 한 칸에 두 자씩 쓴다.
    if (isHalfWidth(curr) && next && isHalfWidth(next)) {
      i++;
    }

    // 줄 바꿈 문자라면 줄을 바꾸고 문단을 끝낸다.
    if (curr === '\n') {
      incLine();
      context.inParagraph = false;
      continue;
    }

    // 공백인데 바로 다음이 따옴표라면 공백을 무시한다.
    if (curr === ' ') {
      if (next === '"' || next === "'") {
        continue;
      }
    }

    if (curr === '"' || curr === "'") {
      // 문단 내에 있다.
      if (context.inParagraph) {
        context.inQuote = !context.inQuote;

        if (context.inQuote) {
          // 여는 따옴표
          incLine();
          i--;
        } else {
          // 닫는 따옴표. 닫고 줄을 바꾼다.
          incLine();
        }

        continue;
      }
    }

    result.squares++;
    context.lineOffset++;
  }

  // 첫 줄인데 끝났다 = 한 줄 빼고 필요하면 한 페이지도 뺀다.
  if (context.lineOffset === 0) {
    result.lines--;
  }

  result.pages = Math.ceil(result.lines / 20);

  return result;
}
