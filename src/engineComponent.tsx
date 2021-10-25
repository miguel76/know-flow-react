import nodeToTask from "./node-to-tasks";
import {TaskEngine} from 'know-flow';
import React, { useState, useEffect, ReactNode } from "react";
import { TaskFactoryOrOptions, getTaskFactory } from "./component";


export default function Engine(
        props: ConstructorParameters<typeof TaskEngine>[0] &
            {children: React.ReactNode, factory?: TaskFactoryOrOptions}) {
    const [generatedChildren, setGeneratedChildren] = useState<ReactNode>([]);
    const engine = new TaskEngine(props);
    const taskFactory = getTaskFactory(props.factory || {});
    useEffect(() => {
        engine.run(nodeToTask(taskFactory, props.children)).then((results) => {
            setGeneratedChildren(results);
        });
    });
    return (
        <div>
            {generatedChildren}
        </div>
    );
}