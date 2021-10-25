import React from "react";
import nodeToTask from "./node-to-tasks";
import {TaskBuilder, TaskFactory, TaskEngine, stringifyTask} from 'know-flow';
import ComponentBuilder from "./component";
import {newEngine as newComunicaEngine} from '@comunica/actor-init-sparql';
import Engine from './engineComponent';

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

let te = new TaskEngine({
  engine: newComunicaEngine(),
  queryContext: {
      sources: [{ type: 'sparql', value: 'https://query.wikidata.org/sparql' }]
  }
});

let task = nodeToTask(taskFactory,
  <kf.input bindings='wd:Q3504248'>
    <p>Una lista di ... </p>
    <kf.value traverse='rdfs:label' lang='it'/>
    <p>ecco ... </p>
    <kf.forEach predicate='^wdt:P31'>
      <p>pianeta</p>
      <kf.value traverse='rdfs:label' lang='it'/>
    </kf.forEach>
  </kf.input>
);

let json = JSON.stringify(stringifyTask(task), null, 4);

const TestComponent:React.FC = (props: any) => (
  <Engine engine={newComunicaEngine()}
      queryContext={{sources: [{ type: 'sparql', value: 'https://query.wikidata.org/sparql' }]}}>
    <p>{json}</p>
    <kf.input bindings='wd:Q3504248'>
      <p>Una lista di ... </p>
      <kf.value traverse='rdfs:label' lang='it'/>
      <p>eccoci ... </p>
      <kf.forEach predicate='^wdt:P31'>
        <p>pianeta</p>
        <kf.value traverse='rdfs:label' lang='it'/>
      </kf.forEach>
    </kf.input>
  </Engine>
);
  
export default TestComponent;

