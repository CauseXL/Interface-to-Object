import { TypescriptParser } from "typescript-parser";
import { TestItem } from "vscode";

// TODO
type AST_NODE = any;

const parser = new TypescriptParser();

export const turnToCode = async (input: string) => {
  let code = "";
  const ast = await parser.parseSource(input);
  // const node = ast.declarations[0] as AST_NODE;
  const node = JSON.parse(JSON.stringify(ast.declarations));
  const props = node?.map((item: AST_NODE) => {
    const { name, properties } = item;
    return {
      pName: name,
      properties: properties?.map((item: AST_NODE) => ({ name: item.name, type: item.type })),
    }
  });

  const hasNoTsInterface = props.some((item: any) => !item.properties);
  // if (hasNoTsInterface) throw 'Only support to transform interface to object!';
  // return hasNoTsInterface;
  // code += `const ${node.name.toLocaleLowerCase()} = {`;
  
  const getProp = (props: AST_NODE[]) => {
    let code = "";
    for (let prop of props) {
      if (!prop) return "";
      const { pName, properties } = prop;
      code += `const ${pName.toLocaleLowerCase()} = {`
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
      code += "};\n";
    }
    return code;
  };
  return JSON.parse(JSON.stringify(getProp(props)));
};
