export type WongojiConfig = {
  /**
   * 큰따옴표 인용문은 항상 새 줄에서 시작한다. false라 하더라도 줄 바꿈 문자가 인용문 앞에 있으면 새 줄에서 시작한다.
   * 기본값 false
   *
   * true: 인용문은 항상 새 줄에서 시작한다.
   * false: 문단 내에 있는 인용문은 줄바꿈을 하지 않는다.
   */
  alwaysNewLineWithQuote?: boolean;

  /**
   * 큰따옴표와 작은따옴표를 “” 혹은 ‘’로 바꾼다. 기본값 false
   */
  useSmartQuote?: boolean;

  /**
   * 점 세 개를 …으로 바꾼다. 기본값 false.
   */
  replaceDotsWithEllipsis?: boolean;
};
