import React from 'react'

export const Attribute: React.FC<{ name: string; children: React.ReactNode }> =
  (props) => {
    return null
  }

export function createElement<P>(
  elementType: React.FunctionComponent<P> | React.ComponentClass<P> | string,
  props: P,
  children: React.ReactNode
) {
  const extracted = extractAttributes(children)
  return React.createElement(
    elementType,
    Object.assign({}, props, extracted.attributes),
    extracted.children
  )
}

function extractAttributes(children: React.ReactNode): {
  children?: React.ReactNode
  attributes?: any
} {
  if (React.isValidElement(children)) {
    if (children.type === Attribute) {
      const attr = {}
      attr[children.props.name] = children.props.children
      return { attributes: attr }
    } else {
      return { children }
    }
  } else if (Array.isArray(children)) {
    const extracted = children.map(extractAttributes)
    const extractedChildren = extracted
      .map((r) => r.children)
      .filter((c) => c !== undefined)
    const newChildren =
      extractedChildren.length === 0 ? undefined : extractedChildren
    const extractedAttributes = extracted
      .map((r) => r.attributes)
      .filter((c) => c !== undefined)
      .flatMap(Object.entries)
    const attributes =
      extractedAttributes.length === 0
        ? undefined
        : Object.fromEntries(extractedAttributes)
    return {
      children: newChildren,
      attributes
    }
  } else {
    return { children }
  }
}
