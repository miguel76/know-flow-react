import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask, Types, TaskFactoryOptions} from 'know-flow';

type TaskFactoryOrOptions = TaskFactory | TaskFactoryOptions;

function getTaskFactory(taskFactoryOrOptions: TaskFactoryOrOptions): TaskFactory {
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

    next<P>(build: (subTask: Types.Task<React.ReactNode>) => Types.Task<React.ReactNode>):
            (new (props: P) => React.Component<P, any>) {
        let mainTaskFactory = this.taskFactory;
        return class extends React.Component<P & {factory?: TaskFactoryOrOptions}> {
            constructor(props: P & {factory?: TaskFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static task(props: P & {factory?: TaskFactoryOrOptions, children?: React.ReactNode}):
                    Types.Task<React.ReactNode> {
                return build(nodeToTask(
                        getTaskFactory(props.factory || mainTaskFactory),
                        props.children));
            }
        };
    }
}
