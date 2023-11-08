export type WongojiConfig = {
  /**
   * 인용문은 항상 새 줄에서 시작한다. false라 하더라도 줄 바꿈 문자가 인용문 앞에 있으면 새 줄에서 시작한다.
   * 기본값 false
   */
  alwaysNewLineWithQuote?: boolean;

  /**
   * 따옴표와 홑따옴표를 “” 혹은 ‘’로 바꾼다. 기본값 false
   */
  useSmartQuote?: boolean;

  /**
   * 점 세 개를 …으로 바꾼다. 기본값 false.
   */
  replaceDotsWithEllipsis?: boolean;
};
