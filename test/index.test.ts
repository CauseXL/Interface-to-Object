import { describe, expect, it } from 'vitest'
import { turnToCode } from '../src/core';

interface TEST {
  name: string;
  age: number;
  dislike: ["test", "test2"];
  like: string[] | number[];
  info: TEST;
  more: {
    name: string;
    age: number;
    like: string[] | number[];
    test: {
      name: string;
      age: number;
      like: string[] | number[];
    };
  };
};

const input = `interface TEST {
  name: string;
  age: number;
  dislike: ["test", "test2"];
  like: string[] | number[];
  info: TEST;
  more: {
    name: string;
    age: number;
    like: string[] | number[];
    test: {
      name: string;
      age: number;
      like: string[] | number[];
    };
  };
};`;

const notTs = 'const a = 1';

describe('working', () => {
  it("should turn to js object", async () => {
    expect(await turnToCode(input)).toMatchInlineSnapshot(`
      "const test = {name: \\"\\",age: 0,dislike: [],like: [],info: {},more: {
          name: string;
          age: number;
          like: string[] | number[];
          test: {
            name: string;
            age: number;
            like: string[] | number[];
          };
        },}"
    `);
  });
})

describe('not working', () => {
  it("should throw error", async () => {
    expect(await turnToCode(notTs)).toMatchInlineSnapshot();
  })
})
