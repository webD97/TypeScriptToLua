import * as ts from 'typescript';
import * as lua from '../../../LuaAST';
import { FunctionVisitor } from '../../context';

export const transformJsxExpression: FunctionVisitor<ts.JsxExpression> = (expression, context) => {
    if (expression.expression) {
        return context.transformExpression(expression.expression);
    }

    return lua.createNilLiteral();
}
