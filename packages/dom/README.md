# Wongoji DOM

원고지 작성법에 따라 주어진 텍스트를 웹 브라우저 환경의 DOM에 그립니다.

## 사용법

원고지 DOM은 원고지를 DOM에 그리는 `render()` 함수를 제공합니다.

```ts
import { render } from '@wongoji/dom';

render(document.querySelector('#root'), {
  // 여기에 설정을 입력합니다.
});
```

## 설정

```ts
{
  /**
   * 원고지 라인 색상
   */
  lineColor?: string;

  /**
   * 원고지 한 장의 줄 수. 기본값 10
   */
  linesPerPage?: number;

  /**
   * 원고지 종이 색상. 기본값 #ffffff
   */
  paperColor?: string;

  /**
   *
   */
}
```


## 원고지 작성법

이 패키지가 따르는 원고지 작성법에 관한 설명은 [taggon/wongoji](https://github.com/taggon/wongoji) 저장소에서 볼 수 있습니다.

## 버그 신고

버그나 이슈는 [taggon/wongoji](https://github.com/taggon/wongoji/issues) 저장소에 등록해주세요.
