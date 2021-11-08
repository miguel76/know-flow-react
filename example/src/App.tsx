import React from "react";
import {ComponentBuilder, Engine, Attribute} from "know-flow-react";
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
    <Card.Img variant="top">
      <Attribute name="src"><kf.Value path='wdt:P18'/></Attribute>
      <Attribute name="alt">Foto del pianeta</Attribute>
    </Card.Img>
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

