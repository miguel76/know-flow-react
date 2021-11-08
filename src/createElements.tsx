import React from "react";

export const Attribute: React.FC<{name: string, children: React.ReactNode}> = props => {
    return null;
}

export function createElement<P>(
        elementType: React.FunctionComponent<P> | React.ComponentClass<P> | string,
        props: P,
        children: React.ReactNode) {
    let extracted = extractAttributes(children);
    return React.createElement(
            elementType,
            Object.assign({}, props, extracted.attributes),
            extracted.children);
}

function extractAttributes(children: React.ReactNode):
        {children?: React.ReactNode, attributes?: any} {
    if (React.isValidElement(children)) {
        if (children.type === Attribute) {
            let attr = {};
            attr[children.props.name] = children.props.children;
            return {attributes: attr};
        } else {
            return {children};
        }
    } else if (Array.isArray(children)) {
        let extracted = children.map(extractAttributes);
        let extractedChildren = extracted.map(r => r.children).filter(c => c !== undefined);
        let newChildren = extractedChildren.length === 0 ? undefined : extractedChildren;
        let extractedAttributes = extracted.map(r => r.attributes).filter(c => c !== undefined).flatMap(Object.entries);
        let attributes = extractedAttributes.length === 0 ? undefined : Object.fromEntries(extractedAttributes);
        return {
            children: newChildren,
            attributes
        };
    } else {
        return {children};
    }
}