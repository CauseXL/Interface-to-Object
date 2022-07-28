import { TypescriptParser } from "typescript-parser";

// * ---------------------------------------------------------------- inter

// TODO
type AST_NODE = any;
type CodeMap = Map<string, string>;
type InterfaceRelation = {
  origin: string;
  extends_from: string;
}

// * ---------------------------------------------------------------- util

const parser = new TypescriptParser();

/** if input include extends keyword, will return two interfaces' relation */
const getInterfaceRelation = (input: string): InterfaceRelation[] => {
  const result: InterfaceRelation[] = [];
  const arr = input.slice().split(' ');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'extends') {
      result.push({
        origin: arr[i - 1],
        extends_from: arr[i + 1]
      });
    }
  }
  return result;
}

const getCodeMapByProp = (props: AST_NODE[]) => {
  const map: CodeMap = new Map();
  let code = "";
  for (let prop of props) {
    code = "\n";
    const { varName, properties } = prop;
    code += `const ${varName?.toLocaleLowerCase()} = {`
    for (let i = 0; i < properties?.length; i++) {
      const { type, name } = properties[i];
      if (type?.toLowerCase() === "string") {
        code += `${name}: "",`;
      } else if (type?.toLowerCase() === "number") {
        code += `${name}: 0,`;
      } else if (type?.indexOf("{") > -1 && type?.indexOf("}") > -1) {
        // TODO: dfs?
        code += `${name}: ${type},`;
      } else if (type?.indexOf("[") > -1 && type?.indexOf("]") > -1) {
        code += `${name}: [],`;
      } else if (type?.toLowerCase() === "boolean" || type?.toLowerCase() === "false") {
        code += `${name}: false,`;
      } else if (type?.toLowerCase() === "true") {
        code += `${name}: true,`;
      } else {
        code += `${name}: {},`;
      }
    }
    code += "};";
    map.set(varName, code);
  }
  return map;
};

/** For supporting extends keyword */
const updateCodeMap = (relation: InterfaceRelation[], codeMap: CodeMap): CodeMap => {
  const newMap = new Map<string, string>(codeMap);
  newMap.forEach((_, key) => {
    if (relation.some(item => item.origin === key)) {
      const extendInterface = relation.find(item => item.origin === key)?.extends_from || '';
      const originCode = newMap.get(key) || '';
      const extendCode = newMap.get(extendInterface) || '';
      const originIndex = originCode?.indexOf('}') || -1;
      const extendIndex = extendCode?.indexOf('{') || -1;
      const newCode = (!!extendCode ? originCode?.slice(0, originIndex) : originCode) + (extendIndex < 0 ? '' : extendCode?.slice(extendIndex + 1));
      newMap.set(key, newCode)
    }
  })
  return newMap
}

const generateCode = (map: CodeMap): string => {
  let code = '';
  map.forEach((value) => {
    code += `${value}\n`;
  })
  return code
}

// * ---------------------------------------------------------------- main

export const turnToCode = async (input: string) => {
  const ast = await parser.parseSource(input);
  const node = JSON.parse(JSON.stringify(ast.declarations));
  const props = node?.map((item: AST_NODE) => {
    const { name, properties } = item;
    return {
      varName: name,
      properties: properties?.map((item: AST_NODE) => ({ name: item.name, type: item.type })),
    }
  });

  const hasNoTsInterface = props.some((item: any) => !item.properties);
  if (hasNoTsInterface) throw 'Only support to transform interface to object!';
  const interface_relation = getInterfaceRelation(input)
  const codeMap = getCodeMapByProp(props)
  const newCodeMap = updateCodeMap(interface_relation, codeMap)
  const code = generateCode(newCodeMap)
  return code
};
