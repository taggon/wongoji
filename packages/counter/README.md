# 원고지 카운터

주어진 텍스트가 원고지 몇 매가 되는지 정확하게 계산합니다. 이 패키지에서 적용하는 규칙은 https://github.com/taggon/wongoji 를 참고하세요.

## 사용법

```js
import count from '@wongoji/counter';

const result = count('Wongoji Counter는 정확한 원고지 매수를 알려주는 유틸리티입니다.');

console.log(result);
// 결과
// {
//   pages: 1,
//   squares: 37,
//   lines: 2, 
// }
```

## 버그 신고

버그나 이슈는 [taggon/wongoji](https://github.com/taggon/wongoji/issues) 저장소에 등록해주세요.
