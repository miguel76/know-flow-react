import React from "react";
import nodeToFlow from "./node-to-flow";
import {FlowBuilder, FlowFactory, PathParam, Types, FlowFactoryOptions} from 'know-flow';

export type FlowFactoryOrOptions = FlowFactory | FlowFactoryOptions;

export function getFlowFactory(flowFactoryOrOptions: FlowFactoryOrOptions): FlowFactory {
    return flowFactoryOrOptions instanceof FlowFactory ?
            flowFactoryOrOptions :
            new FlowFactory(flowFactoryOrOptions);
}

export class KnowFlowComponent<P> extends React.Component<P & {factory?: FlowFactoryOrOptions}> {
    static flow(props: any & {factory?: FlowFactoryOrOptions, children?: React.ReactNode}):
            Types.Flow<React.ReactNode> {
        return nodeToFlow(getFlowFactory(props.factory || {}), props.children);
    }
}

type valueOfParams = {path?: string};

export default class ComponentBuilder {
    flowFactory: FlowFactory;

    constructor(flowFactoryOrOptions: FlowFactoryOrOptions = {}) {
        this.flowFactory = getFlowFactory(flowFactoryOrOptions);
    }

    static isOwnComponent(element: React.ReactElement): boolean {
        return KnowFlowComponent.isPrototypeOf(element.type);
    }

    // React.ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>>.type: string | React.JSXElementConstructor<any>

    static isOwnComponentType(elementType: React.ReactElement['type']): elementType is typeof KnowFlowComponent {
        return KnowFlowComponent.isPrototypeOf(elementType);
    }

    componentWithoutChildren<P>(displayName: string, build: (props: P) => Types.Flow<React.ReactNode>):
            (new (props: P) => React.Component<P, any>) {
        let mainFlowFactory = this.flowFactory;
        let componentClass = class extends KnowFlowComponent<P> {
            constructor(props: P & {factory?: FlowFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static flow(props: P & {factory?: FlowFactoryOrOptions}):
                    Types.Flow<React.ReactNode> {
                return build(props);
            }
            static displayName = displayName;
        };
        return componentClass;
    }

    component<P>(displayName: string, build: (props: P, subflow: Types.Flow<React.ReactNode>) => Types.Flow<React.ReactNode>):
            (new (props: P & {factory?: FlowFactoryOrOptions}) => React.Component<P& {factory?: FlowFactoryOrOptions}, any>) {
        let mainFlowFactory = this.flowFactory;
        let componentClass = class extends KnowFlowComponent<P> {
            constructor(props: P & {factory?: FlowFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static flow(props: P & {factory?: FlowFactoryOrOptions, children: React.ReactNode}):
                    Types.Flow<React.ReactNode> {
                return build(props, nodeToFlow(
                        getFlowFactory(props.factory || mainFlowFactory),
                        props.children));
            }
            static displayName = displayName;
        };
        return componentClass;
    }

    Value = this.componentWithoutChildren('Value',
            (props: Parameters<FlowFactory['createValueReader']>[0]) =>
                (this.flowFactory.createValueReader(props)));

    Traverse = this.component('Traverse', (
            props: Omit<Parameters<FlowFactory['createTraverse']>[0], 'subflow'>,
            subflow: Types.Flow<React.ReactNode>) => {
        return (this.flowFactory.createTraverse(Object.assign({subflow},props)));
    });
                   
    Join = this.component('Join', (
                props: Omit<Parameters<FlowFactory['createJoin']>[0], 'subflow'>,
                subflow: Types.Flow<React.ReactNode>) =>
            (this.flowFactory.createJoin(Object.assign({subflow},props))));
    
    ForEach = this.component('ForEach', (
                props: {path?: PathParam},
                subflow: Types.Flow<React.ReactNode>) =>
            (this.flowFactory.createForEach(Object.assign({subflow},props))));

    Input = this.component('Input', (
                props: Omit<Parameters<FlowFactory['createValues']>[0], 'subflow'>,
                subflow: Types.Flow<React.ReactNode>) =>
            (this.flowFactory.createValues(Object.assign({subflow},props))));
}
