/* eslint @typescript-eslint/no-use-before-define: ["error", { "functions": false }] */

import React, { isValidElement } from 'react'
import { FlowFactory, Types } from 'know-flow'
import ComponentBuilder from './componentBuilder'
import { createElement } from './createElements'

export function valueToFlow(
  flowFactory: FlowFactory,
  obj: any
): Types.Flow<any> {
  return obj instanceof Types.Flow ? obj : flowFactory.createConstant(obj)
}

// function isReactPortal(node: React.ReactNode): node is React.ReactPortal {
//   return node !== undefined && typeof node === 'object' && 'children' in node
// }

export function elementToFlow(
  flowFactory: FlowFactory,
  element: React.ReactElement
): Types.Flow<React.ReactElement> {
  // Shoul we add children (outside of props) if it is a ReactPortal?
  return flowFactory.createCascade({
    subflow: flowFactory.createParallelDict({
      props: componentAttributesToFlow(flowFactory, element.props),
      children: nodeToFlow(flowFactory, element.props.children)
    }),
    action: (result) =>
      createElement(element.type, result.props, result.children)
  })
}

export default function nodeToFlow(
  flowFactory: FlowFactory,
  node: React.ReactNode
): Types.Flow<React.ReactNode> {
  if (node instanceof Types.Flow) {
    return node
  } else if (isValidElement(node)) {
    if (ComponentBuilder.isOwnComponentType(node.type)) {
      return node.type.flow(node.props)
    } else {
      return elementToFlow(flowFactory, node)
    }
  } else if (Array.isArray(node)) {
    return flowFactory.createParallel(
      node.map((n) => nodeToFlow(flowFactory, n))
    )
  } else {
    return flowFactory.createConstant(node)
  }
}

export function componentAttributesToFlow(
  flowFactory: FlowFactory,
  props: any
): Types.Flow<React.Component> {
  const attrEntries = Object.entries(props).filter(
    ([name, value]) => name !== 'children'
  )
  const attrNames = attrEntries.map(([name, value]) => name)
  return flowFactory.createCascade({
    subflow: flowFactory.createParallel(
      attrEntries.map(([name, value]) => valueToFlow(flowFactory, value))
    ),
    action: (res: any[]) =>
      Object.fromEntries(res.map((value, index) => [attrNames[index], value]))
  })
}
