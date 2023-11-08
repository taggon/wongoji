import { expect, test } from 'bun:test';
import { parse } from './parse';

const testCases = [
  '안녕하세요. 반갑습니다.',
  '대한민국은 Korea이다.',
  '걸음도 해깝고 방울소리가 밤 벌판에 한층 청청하게 울렸다.\n달이 어지간히 기울어졌다.',
  '"이걸 까셀라 부다!"하고 소리를 쳤다.',
  '대체 이게 웬 속인지(지금까지도 난 영문을 모른다) 아버질 혼내 주기는 제가 내래 놓고 이제 와서는 달려들며, "에그머니! 이 망할 게 아버지 죽이네!" 하고 내 귀를 뒤로 잡아당기며 마냥 우는 것이 아니냐.'
];

testCases.forEach((text, index) => {
  test(`Case #${index + 1}: ${text}`, () => {
    expect(parse(text)).toMatchSnapshot();
  });
});

test('replaceDotsWithEllipsis 옵션을 켜면 점 세 개를 …으로 변경한다.', () => {
  expect(parse('그런...', { replaceDotsWithEllipsis: false })).toMatchSnapshot();
  expect(parse('그런...', { replaceDotsWithEllipsis: true })).toMatchSnapshot();
});
