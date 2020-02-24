import { FunctionVisitor } from "../../context";
import * as ts from 'typescript';
import * as lua from '../../../LuaAST';
import { createJsxFactoryIdentifier, transformTagName } from "./helpers";

export const transformJsxSelfClosingElement: FunctionVisitor<ts.JsxSelfClosingElement> = (node, context) => {
    const jsxFactory = createJsxFactoryIdentifier(context);
    const tagIdentifier = transformTagName(node.tagName.getText());
    const propertiesExpression = context.transformExpression(node.attributes);

    return lua.createCallExpression(jsxFactory, [tagIdentifier, propertiesExpression], node);
};
