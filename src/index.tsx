import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask} from 'know-flow';
import ComponentBuilder from "./component";

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

let taskFactory = new TaskFactory(options);
let tb = new TaskBuilder(options);

let kf = new ComponentBuilder(options);

let task = nodeToTask(taskFactory,
  <div id='pippo'>
    <p>prova</p>
  </div>
);

let json = JSON.stringify(stringifyTask(task), null, 4);

  

const TestComponent:React.FC = (props: any) => (

<div id='pippo'>
  <h1>json</h1>
  <p>{json}</p>
</div>
);

export default TestComponent;

