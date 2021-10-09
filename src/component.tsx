import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask, Types, TaskFactoryOptions} from 'know-flow';

type TaskFactoryOrOptions = TaskFactory | TaskFactoryOptions;

function getTaskFactory(taskFactoryOrOptions: TaskFactoryOrOptions): TaskFactory {
    return taskFactoryOrOptions instanceof TaskFactory ?
            taskFactoryOrOptions :
            new TaskFactory(taskFactoryOrOptions);
}

export default class ComponentBuilder {
    taskFactory: TaskFactory;

    constructor(taskFactoryOrOptions: TaskFactoryOrOptions = {}) {
        this.taskFactory = getTaskFactory(taskFactoryOrOptions);
    }

    apply<P>(build: (subTask: Types.Task<React.ReactNode>) => Types.Task<React.ReactNode>):
            (new (props: P) => React.Component<P, any>) {
        let mainTaskFactory = this.taskFactory;
        return class extends React.Component<P & {factory?: TaskFactoryOrOptions}> {
            constructor(props: P & {factory?: TaskFactoryOrOptions}) {
                super(props);
            }
            render(): React.ReactNode {
                return null;
            }
            static task(props: any & {factory?: TaskFactoryOrOptions}):
                    Types.Task<React.ReactNode> {
                return build(nodeToTask(
                        getTaskFactory(props.factory || mainTaskFactory),
                        props.children));
            }
        };
    }
}
