import React, {isValidElement} from "react";
import ReactDOM from 'react-dom';
import { TaskFactory, Tasks } from "know-flow";
import { Task } from "know-flow/dist/task";
import KnowFlowComponent from './component';

export function valueToTask(taskFactory: TaskFactory, obj: any): Tasks.Task<any> {
    return (obj instanceof Tasks.Task) ? obj : taskFactory.createConstant(obj);
}

// children?: ReactNode | undefined
//     type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

// type ReactChild = ReactElement | ReactText;

// interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
//     type: T;
//     props: P;
//     key: Key | null;
// }

// type JSXElementConstructor<P> =
// | ((props: P) => ReactElement<any, any> | null)
// | (new (props: P) => Component<P, any>);

// type ReactText = string | number;

// type ReactFragment = {} | ReactNodeArray;
// interface ReactNodeArray extends Array<ReactNode> {}

// interface ReactPortal extends ReactElement {
//     key: Key | null;
//     children: ReactNode;
// }

function isReactPortal(node: React.ReactNode): node is React.ReactPortal {
    return node != undefined && typeof node === 'object' && 'children' in node;
}

export function elementToTask(taskFactory: TaskFactory, element: React.ReactElement):
        Tasks.Task<React.ReactElement> {
    // Shoul we add children (outside of props) if it is a ReactPortal?
    return taskFactory.createCascade({
        task: taskFactory.createParallelDict({
            props: componentAttributesToTask(taskFactory, element.props),
            children: nodeToTask(taskFactory, element.props.children)
        }),
        // action: (result) => React.cloneElement(comp, result.props)
        action: (result) => React.createElement(element.type, result.props, result.children)
    });
}

export default function nodeToTask(taskFactory: TaskFactory, node: React.ReactNode):
        Tasks.Task<React.ReactNode> {
    console.log(node);
    if (node instanceof Tasks.Task) {
        return node;
    } else if (isValidElement(node)) {
        if (KnowFlowComponent.isPrototypeOf(node.type)) {
            console.log('is kf component');
            console.log(node.props.task);
            return node.props.task;
        } else {
            console.log('is other element');
            return elementToTask(taskFactory, node);
        }
    } else if (Array.isArray(node)) {
        return taskFactory.createParallel(node.map(n => nodeToTask(taskFactory, n)));
    } else {
        return taskFactory.createConstant(node);
    }
}

export function componentAttributesToTask(taskFactory: TaskFactory, props: any):
        Tasks.Task<React.Component> {
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


