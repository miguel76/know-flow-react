import React, {isValidElement} from "react";
import ReactDOM from 'react-dom';
import { TaskFactory, Types } from "know-flow";
import { Task } from "know-flow/dist/task";
import ComponentBuilder from './component';

export function valueToTask(taskFactory: TaskFactory, obj: any): Types.Task<any> {
    return (obj instanceof Types.Task) ? obj : taskFactory.createConstant(obj);
}

function isReactPortal(node: React.ReactNode): node is React.ReactPortal {
    return node != undefined && typeof node === 'object' && 'children' in node;
}

export function elementToTask(taskFactory: TaskFactory, element: React.ReactElement):
        Types.Task<React.ReactElement> {
    // Shoul we add children (outside of props) if it is a ReactPortal?
    return taskFactory.createCascade({
        task: taskFactory.createParallelDict({
            props: componentAttributesToTask(taskFactory, element.props),
            children: nodeToTask(taskFactory, element.props.children)
        }),
        action: (result) => React.createElement(element.type, result.props, result.children)
    });
}

export default function nodeToTask(taskFactory: TaskFactory, node: React.ReactNode):
        Types.Task<React.ReactNode> {
    if (node instanceof Types.Task) {
        return node;
    } else if (isValidElement(node)) {
        if (ComponentBuilder.isOwnComponentType(node.type)) {
            return node.type.task(node.props);
        } else {
            return elementToTask(taskFactory, node);
        }
    } else if (Array.isArray(node)) {
        return taskFactory.createParallel(node.map(n => nodeToTask(taskFactory, n)));
    } else {
        return taskFactory.createConstant(node);
    }
}

export function componentAttributesToTask(taskFactory: TaskFactory, props: any):
        Types.Task<React.Component> {
    let attrEntries = Object.entries(props).filter(([name, value]) => name != 'children');
    let attrNames = attrEntries.map(([name, value]) => name);
    return taskFactory.createCascade({
        task: taskFactory.createParallel(
            attrEntries.map(([name, value]) => valueToTask(taskFactory, value))
        ),
        action: (res: any[]) =>
                Object.fromEntries(res.map((value, index) => [attrNames[index], value]))
    });
}


