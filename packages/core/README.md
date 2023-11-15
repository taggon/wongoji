# Wongoji Core

원고지 유틸리티의 코어 기능을 담당합니다.

## APIs

이 패키지에는 2개의 함수를 제공합니다.

### `parse(text, config)`


주어진 텍스트를 분석하여 `Document` 타입으로 반환합니다.

```ts
import { parse } from '@wongoji/core';

const doc = parse('안녕하세요.');

console.log(doc);

// {
//    type: 'document',
//    nodes: [,
//       {
//          type: 'fulltext',
//          raw: '안녕하세요',
//       },
//       {
//          type: 'punctuation',
//          raw: '.',
//       },
//    ],
// }
```

### `format(text, config)`

주어진 텍스트를 원고지 작성 방식에 맞게 나눈 2차원 배열을 작성합니다. 1차 배열은 원고지의 한 줄을 의미하고, 2차 배열의 원소는 원고지의 한 칸을 의미합니다.


```ts
import { format } from '@wongoji/core';

const lines = format('걸음도 해깝고 방울소리가 밤 벌판에 한층 청청하게 울렸다.\n달이 어지간히 기울어졌다.');

console.log(lines);

// [' ', '걸', '음', '도', ' ', '해', '깝', '고', ' ', '방', '울', '소', '리', '가', ' ', '밤', ' ', '벌', '판', '에'],
// ['한', '층', ' ', '청', '청', '하', '게', ' ', '울', '렸', '다', '.'],
// [' ', '달', '이', ' ', '어', '지', '간', '히', ' ', '기', '울', '어', '졌', '다', '.'],
```

### Config

API를 호출할 때 객체를 전달하여 동작을 조정할 수 있습니다. 구조는 다음과 같습니다.

```ts
{
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
}
```

## 원고지 작성법

이 패키지가 따르는 원고지 작성법에 관한 설명은 [taggon/wongoji](https://github.com/taggon/wongoji) 저장소에서 볼 수 있습니다.

## 버그 신고

버그나 이슈는 [taggon/wongoji](https://github.com/taggon/wongoji/issues) 저장소에 등록해주세요.
