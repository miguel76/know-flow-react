import React, { useState, useEffect, ReactNode } from 'react'
import nodeToFlow from './node-to-flow'
import { FlowEngine } from 'know-flow'
import { FlowFactoryOrOptions, getFlowFactory } from './componentBuilder'

export default function Engine(
  props: ConstructorParameters<typeof FlowEngine>[0] & {
    children: React.ReactNode
    factory?: FlowFactoryOrOptions
  }
) {
  const [generatedChildren, setGeneratedChildren] = useState<ReactNode>([])
  const engine = new FlowEngine(props)
  const flowFactory = getFlowFactory(props.factory || {})
  useEffect(() => {
    engine.run(nodeToFlow(flowFactory, props.children)).then((results) => {
      setGeneratedChildren(results)
    })
  })
  return <div>{generatedChildren}</div>
}
