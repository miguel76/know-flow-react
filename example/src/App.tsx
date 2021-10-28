import React from "react";
import {ComponentBuilder, Engine} from "know-flow-react";
import {newEngine as newComunicaEngine} from '@comunica/actor-init-sparql';

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

let kf = new ComponentBuilder(options);

// let task = nodeToFlow(taskFactory,
//   <kf.Input bindings='wd:Q3504248'>
//     <p>Una lista di ... </p>
//     <kf.Value path='rdfs:label' lang='it'/>
//     <p>ecco ... </p>
//     <kf.ForEach path='^wdt:P31'>
//       <p>pianeta</p>
//       <kf.Value path='rdfs:label' lang='it'/>
//     </kf.ForEach>
//   </kf.Input>
// );

// let json = JSON.stringify(stringifyFlow(task), null, 4);

const TestComponent:React.FC = (props: any) => (
  <Engine engine={newComunicaEngine()}
      queryContext={{sources: [{ type: 'sparql', value: 'https://query.wikidata.org/sparql' }]}}>
    {/* <p>{json}</p> */}
    <kf.Input bindings='wd:Q3504248'>
      <p>Una lista di ... </p>
      <kf.Value path='rdfs:label' lang='it'/>
      <p>eccoci ... </p>
      <kf.ForEach path='^wdt:P31'>
        <p>pianeta</p>
        <kf.Value path='rdfs:label' lang='it'/>
      </kf.ForEach>
    </kf.Input>
  </Engine>
);
  
export default TestComponent;

