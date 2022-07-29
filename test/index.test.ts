import { describe, expect, it } from 'vitest'
import { turnToCode } from '../src/core';

const input = `interface TEST {
  name: string;
  age: number;
  dislike: ["test", "test2"];
  like: string[] | number[];
  info: TEST;
  isSingle: true;
  isMarried: boolean;
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

describe('working with single situation', () => {
  it("should turn to js object", async () => {
    expect(await turnToCode(input)).toMatchInlineSnapshot(`
      "
      const test = {name: \\"\\",age: 0,dislike: [],like: [],info: {},isSingle: true,isMarried: false,more: {
          name: string;
          age: number;
          like: string[] | number[];
          test: {
            name: string;
            age: number;
            like: string[] | number[];
          };
        },};
      "
    `);
  });
})

const input_extends = `interface A extends B {
  a: string;
  c: number;
}
interface B {
  b: string;
  d: boolean;
  e: true;
  f: false;
}`;

const input_extends2 = `interface A extends B {
  a: string;
}`

describe('working with extends situation', () => {
  it("should working with extends", async () => {
    expect(await turnToCode(input_extends)).toMatchInlineSnapshot(`
      "
      const a = {a: \\"\\",c: 0,b: \\"\\",d: false,e: true,f: false,};

      const b = {b: \\"\\",d: false,e: true,f: false,};
      "
    `);
    expect(await turnToCode(input_extends2)).toMatchInlineSnapshot(`
      "
      const a = {a: \\"\\",};
      "
    `)
  })
})

// describe('not working', () => {
//   it("should throw error", async () => {
//     expect(await turnToCode(notTs)).toMatchInlineSnapshot(`
//       "const a = {};

//       "
//     `);
//   })
// })
