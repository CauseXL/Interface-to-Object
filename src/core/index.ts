import { TypescriptParser } from "typescript-parser";

const parser = new TypescriptParser();

export const turnToCode = async (input: string) => {
  let code = "";
  const ast = await parser.parseSource(input);
  const node = ast.declarations[0] as any;
  const props = node.properties;
  code += `const ${node.name.toLocaleLowerCase()} = {`;

  const getProp = (props: any[]) => {
    let code = "";
    for (let prop of props) {
      if (!prop) return "";
      const { type, name } = prop;
      if (type === "string") {
        code += `${name}: "",`;
      } else if (type === "number") {
        code += `${name}: 0,`;
      } else if (type.indexOf("{") > -1 && type.indexOf("}") > -1) {
        // TODO: dfs?
        code += `${name}: ${type},`;
      } else if (type.indexOf("[") > -1 && type.indexOf("]") > -1) {
        code += `${name}: [],`;
      } else {
        code += `${name}: {},`;
      }
    }
    return code;
  };
  code += getProp(props) + "}";
  return JSON.parse(JSON.stringify(code));
};
