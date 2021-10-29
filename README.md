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

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from "react-bootstrap";

let options = {
    prefixes: {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'wd': 'http://www.wikidata.org/entity/',
        'wdt': 'http://www.wikidata.org/prop/direct/',
        'schema': 'http://schema.org/'
    }
};

let kf = new ComponentBuilder(options);

const PlanetInfo = kf.pack('PlanetInfo', (props: any) => (
  <Card>
    <Card.Body>
      <Card.Title><kf.Value path='rdfs:label' lang='it'/></Card.Title>
      <Card.Text><kf.Value path='schema:description' lang='it'/></Card.Text>
    </Card.Body>
  </Card>
));

const TestComponent:React.FC = (props: any) => (
  <Engine engine={newComunicaEngine()}
      queryContext={{sources: [{ type: 'sparql', value: 'https://query.wikidata.org/sparql' }]}}>
    <kf.Input bindings='wd:Q3504248'>
      <Container>
        <Row>
          <Col><h1><kf.Value path='rdfs:label' lang='it'/></h1></Col>
        </Row>
        <kf.ForEach path='^wdt:P31'>
          <Row>
            <Col><PlanetInfo/></Col>
          </Row>
        </kf.ForEach>
      </Container>
    </kf.Input>
  </Engine>
);

export default TestComponent;
```

## License

MIT © [miguel76](https://github.com/miguel76)
