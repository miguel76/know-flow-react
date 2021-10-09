import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask, Tasks} from 'know-flow';
import KnowFlowComponent from "./component";

let options = {
    prefixes: {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'dbo': 'http://dbpedia.org/ontology/',
        'dbr': 'http://dbpedia.org/resource/',
        'wd': 'http://www.wikidata.org/entity/',
        'wdt': 'http://www.wikidata.org/prop/direct/'
    }
};


interface ValueProps {
    path?: string
}

class Value extends KnowFlowComponent<ValueProps> {
    constructor(props: ValueProps) {
      super(props, tb.value(props.path));
      console.log(props.path);
    }
}
  
let taskFactory = new TaskFactory(options);
let tb = new TaskBuilder(options);

// let task = nodeToTask(taskFactory,
//   <div id='pippo'>
//     <p>prova</p>
//     <p><Value path='rdfs:label'/></p>
//   </div>
// );

let task = nodeToTask(taskFactory,
  // <Value path='rdfs:label'/>
  <div id='pippo'>
    <p>prova</p>
    <p>{tb.value()}</p>
  </div>
);

let json = JSON.stringify(stringifyTask(task), null, 4);
console.log('json');

const TestComponent:React.FC = (props: any) => (

<div id='pippo'>
  <h1>json</h1>
  <p>{json}</p>
  {/* <p><Value path='rdfs:label'/></p> */}
</div>
);

export default TestComponent;

