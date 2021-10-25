import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask, Types, TaskFactoryOptions} from 'know-flow';
import { PathParamType } from "know-flow/dist/taskFactory";

export type TaskFactoryOrOptions = TaskFactory | TaskFactoryOptions;

export function getTaskFactory(taskFactoryOrOptions: TaskFactoryOrOptions): TaskFactory {
    return taskFactoryOrOptions instanceof TaskFactory ?
            taskFactoryOrOptions :
            new TaskFactory(taskFactoryOrOptions);
}

export class KnowFlowComponent<P> extends React.Component<P & {factory?: TaskFactoryOrOptions}> {
    static task(props: any & {factory?: TaskFactoryOrOptions, children?: React.ReactNode}):
            Types.Task<React.ReactNode> {
        return nodeToTask(getTaskFactory(props.factory || {}), props.children);
    }
}

type valueOfParams = {path?: string};

export default class ComponentBuilder {
    taskFactory: TaskFactory;

    constructor(taskFactoryOrOptions: TaskFactoryOrOptions = {}) {
        this.taskFactory = getTaskFactory(taskFactoryOrOptions);
    }

    static isOwnComponent(element: React.ReactElement): boolean {
        return KnowFlowComponent.isPrototypeOf(element.type);
    }

    // React.ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>>.type: string | React.JSXElementConstructor<any>

    static isOwnComponentType(elementType: React.ReactElement['type']): elementType is typeof KnowFlowComponent {
        return KnowFlowComponent.isPrototypeOf(elementType);
    }

    componentWithoutChildren<P>(displayName: string, build: (props: P) => Types.Task<React.ReactNode>):
            (new (props: P) => React.Component<P, any>) {
        let mainTaskFactory = this.taskFactory;
        let componentClass = class extends KnowFlowComponent<P> {
            constructor(props: P & {factory?: TaskFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static task(props: P & {factory?: TaskFactoryOrOptions}):
                    Types.Task<React.ReactNode> {
                return build(props);
            }
            static displayName = displayName;
        };
        return componentClass;
    }

    component<P>(displayName: string, build: (props: P, subtask: Types.Task<React.ReactNode>) => Types.Task<React.ReactNode>):
            (new (props: P & {factory?: TaskFactoryOrOptions}) => React.Component<P& {factory?: TaskFactoryOrOptions}, any>) {
        let mainTaskFactory = this.taskFactory;
        let componentClass = class extends KnowFlowComponent<P> {
            constructor(props: P & {factory?: TaskFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static task(props: P & {factory?: TaskFactoryOrOptions, children: React.ReactNode}):
                    Types.Task<React.ReactNode> {
                return build(props, nodeToTask(
                        getTaskFactory(props.factory || mainTaskFactory),
                        props.children));
            }
            static displayName = displayName;
        };
        return componentClass;
    }

    value = this.componentWithoutChildren('value',
            (props: Parameters<TaskFactory['createValueReader']>[0]) =>
                (this.taskFactory.createValueReader(props)));

    traverse = this.component('traverse', (
            props: Omit<Parameters<TaskFactory['createTraverse']>[0], 'subtask'>,
            subtask: Types.Task<React.ReactNode>) => {
        return (this.taskFactory.createTraverse(Object.assign({subtask},props)));
    });
                   
    join = this.component('join', (
                props: Omit<Parameters<TaskFactory['createJoin']>[0], 'subtask'>,
                subtask: Types.Task<React.ReactNode>) =>
            (this.taskFactory.createJoin(Object.assign({subtask},props))));
    
    forEach = this.component('forEach', (
                props: {predicate?: PathParamType},
                subtask: Types.Task<React.ReactNode>) =>
            (this.taskFactory.createForEach(Object.assign({subtask},props))));

    input = this.component('input', (
                props: Omit<Parameters<TaskFactory['createValues']>[0], 'subtask'>,
                subtask: Types.Task<React.ReactNode>) =>
            (this.taskFactory.createValues(Object.assign({subtask},props))));
}
