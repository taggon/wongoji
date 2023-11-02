import { expect, test } from 'bun:test';
import counter from './index';

const testCases = [
  {
    description: '문단의 첫 칸은 들여쓰기를 해야 한다.',
    text: '우리 나라는 해마다 많은 양의 에너지 자원을 수입한다.',
    pages: 1,
    squares: 31,
    lines: 2,
  },
  {
    description: '원래는 띄어쓰기가 있지만 칸을 맞추기 위해 무시해야 하는 경우',
    text: '밥을 먹고 있는데, 뒤에서 쿵쾅거리는 소리가 났다.',
    pages: 1,
    squares: 27,
    lines: 2,
  },
  {
    description: '따옴표 안의 문장은 새 줄을 시작할 때 줄의 처음 한 칸을 비운다.',
    text: '"현도야 내일 외할머니 생신이란다. 너도 같이 가야지?"',
    pages: 1,
    squares: 32,
    lines: 2,
  },
  {
    description: '따옴표가 말의 중간에 있을 때에도 줄을 바꿔 쓴다.',
    text: '책을 보는데 갑자기 수제비가 먹고싶어졌다. 그래서 난 "엄마, 오늘 저녁밥은 수제비로 했으면 좋겠어요."하고 말씀 드렸다.',
    pages: 1,
    squares: 67,
    lines: 5,
  },
  {
    description: '다음 줄 시작이 마침표가 될 것 같으면 앞 줄 끝에 마침표를 찍는다.',
    text: '어서 세수하고 밥 먹자 학교 늦겠다.',
    pages: 1,
    squares: 20,
    lines: 1,
  },
  {
    description: '한 자리 숫자는 한 칸에 한 글자씩 쓰고, 덩어리 숫자는 한 칸에 두 자씩 쓴다.',
    text: '1년 후, 2034년 10월 5일에',
    pages: 1,
    squares: 16,
    lines: 1,
  },
  {
    description: '대문자는 한 칸에 쓴다',
    text: 'Korea는 대한민국이다.',
    pages: 1,
    squares: 13,
    lines: 1,
  },
];

testCases.forEach(({ description, text, pages, squares, lines }, idx) => {
  test(description, () => {
    const result = counter(text);
    expect(result).toEqual({ pages, squares, lines });
  });
});
