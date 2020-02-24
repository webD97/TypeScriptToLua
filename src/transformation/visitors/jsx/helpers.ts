import { TransformationContext } from "../../context";
import * as lua from '../../../LuaAST';
import * as ts from 'typescript';

/**
 * Transform the tag name to either a string literal (for intrinsic elements) or an identifier (for value-based elements)
 * @param tagName
 */
export function transformTagName(tagName: string) {
    return isIntrinsicElementTagName(tagName) ?
        lua.createStringLiteral(tagName) :
        lua.createIdentifier(tagName);
}

/**
 * Transform the jsxFactory to a Lua identifier
 * @param factoryPath
 */
export function createJsxFactoryIdentifier(context: TransformationContext) {
    const {
        jsxFactory = 'React.createElement'
    } = context.options;

    return jsxFactory
        .split('.')
        .reduce<lua.Expression>((accumulator, current, index, factoryPath) => {
            if (index > 0) {
                return lua.createTableIndexExpression(accumulator, lua.createStringLiteral(current));
            }
            return lua.createIdentifier(factoryPath[0]);
        }, lua.createNilLiteral());
}

/**
 * Check if a tag name refers to an intrinsic element (convention: tag name starts with a lowercase letter)
 * @param tagName
 */
export function isIntrinsicElementTagName(tagName: string) {
    return tagName.toLowerCase() === tagName;
}


export function transformJsxChildren(node: ts.JsxElement, context: TransformationContext) {
    const childrenOrStringLiterals = node.children
        .filter(child => !ts.isJsxText(child) || child.text.trim() !== '')
        .map(child =>
            ts.isJsxText(child)
                ? ts.createStringLiteral(child.text.trim())
                : child
        );

    return childrenOrStringLiterals.map((child) => context.transformExpression(child))
}
