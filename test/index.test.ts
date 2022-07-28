import { describe, expect, it } from 'vitest'
import { turnToCode } from '../src/core';
import { TypescriptParser } from "typescript-parser";
const parser = new TypescriptParser();

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
        },};
      "
    `);
  });
})
interface A {
  a: string
}
interface B extends A {
  b: string
}

const input_extends = `interface A {
  a: string;
  c: number;
}
interface B {
  b: string;
  d: boolean;
  e: true;
  f: false;
}`;

const test = `interface A {
  a: string;
}`

describe('extends', () => {
  it("should working with extends", async () => {
    expect(await turnToCode(input_extends)).toMatchInlineSnapshot(`
      "const a = {a: \\"\\",c: 0,};
      const b = {b: \\"\\",d: false,e: true,f: false,};
      "
    `);
  })
  it("should working with extends", async () => {
    const ast = await parser.parseSource(test)
    const node = JSON.parse(JSON.stringify(ast.declarations));    // // const node = ast.declarations;
    // const props = node?.properties;
    expect(ast).toMatchInlineSnapshot(`
      File {
        "declarations": [
          InterfaceDeclaration {
            "accessors": [],
            "end": 28,
            "isExported": false,
            "methods": [],
            "name": "A",
            "properties": [
              PropertyDeclaration {
                "end": 26,
                "isOptional": false,
                "isStatic": false,
                "name": "a",
                "start": 16,
                "type": "string",
                "visibility": 2,
              },
            ],
            "start": 0,
          },
        ],
        "end": 28,
        "exports": [],
        "filePath": "inline.tsx",
        "imports": [],
        "resources": [],
        "rootPath": "/",
        "start": 0,
        "usages": [
          "a",
        ],
      }
    `);
  })
})

describe('not working', () => {
  it("should throw error", async () => {
    expect(await turnToCode(notTs)).toMatchInlineSnapshot(`
      "const a = {};
      "
    `);
  })
})
