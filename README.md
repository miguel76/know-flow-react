# know-flow-react

> React library for building modular linked data-centric UIs

[![NPM](https://img.shields.io/npm/v/know-flow-react.svg)](https://www.npmjs.com/package/know-flow-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save know-flow-react
```

## Usage

```tsx
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

const Example:React.FC = (props: any) => (
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
```

## License

MIT © [miguel76](https://github.com/miguel76)
