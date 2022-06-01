import { describe, expect, it } from 'vitest'
import { turnToCode } from '../src/core';

const input = `interface TEST {
  name: string;
  age: number;
  dislike: ['test', 'test2'];
  like: string[] | number[];
  info: TEST;
  more: {
    name: string;
    age: number;
    like: string[] | number[];
    test: TEST
  };
}`;

describe('should', () => {
  it("exported", async () => {
    expect(await turnToCode(input)).toMatchInlineSnapshot(`
      "const test = {name: \\"\\",age: 0,dislike: [],like: [],info: {},more: {
          name: string;
          age: number;
          like: string[] | number[];
          test: TEST
        },}"
    `);
  });
})
