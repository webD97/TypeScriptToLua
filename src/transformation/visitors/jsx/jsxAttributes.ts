import * as ts from 'typescript';
import * as lua from '../../../LuaAST';
import { FunctionVisitor } from '../../context';

export const transformJsxAttributes: FunctionVisitor<ts.JsxAttributes> = (expression, context) => {
    if (expression.properties.find(element => element.kind === ts.SyntaxKind.JsxSpreadAttribute)) {
      throw new Error('Unsupported: JsxSpreadAttribute');
    }

    const properties = expression.properties
        .filter((element): element is ts.JsxAttribute => element.kind !== ts.SyntaxKind.JsxSpreadAttribute)
        .map(element => {
            const valueOrExpression = element.initializer
                ? element.initializer
                : ts.createLiteral(true);
            return ts.createPropertyAssignment(element.name, valueOrExpression);
        });

    return lua.createTableExpression(
        properties.map(property =>
            lua.createTableFieldExpression(
                context.transformExpression(property.initializer),
                lua.createStringLiteral(property.name.getText())
            )
        )
    )
};
