import { FunctionVisitor } from "../../context";
import * as ts from 'typescript';
import * as lua from '../../../LuaAST';
import { createJsxFactoryIdentifier, transformTagName, transformJsxChildren } from "./helpers";

export const transformJsxElement: FunctionVisitor<ts.JsxElement> = (node, context) => {
    const jsxFactory = createJsxFactoryIdentifier(context);
    const tagIdentifier = transformTagName(node.openingElement.tagName.getText());
    const propertiesExpression = context.transformExpression(node.openingElement.attributes);
    const children = transformJsxChildren(node, context);

    return lua.createCallExpression(jsxFactory, [tagIdentifier, propertiesExpression, ...children], node);
};
