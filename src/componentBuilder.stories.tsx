import React, {PropsWithChildren, ReactNode} from 'react';
import { Meta, Story } from '@storybook/react';
import {ComponentBuilder, Engine} from "./index";
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

// This is meta information about our component
const meta: Meta<PropsWithChildren<{}>> = {
    title: 'Value',  // What title to display in component story page
    component: kf.Value,  // This one is obvious :-)
    argTypes: {  // Here we can specify configuration for our component's props
      path: {
        description: 'Property path optionally traversed before getting the value.',
        control: {
          type: 'text',
        },
      },
    },
  };
  
const ValueTemplate: Story<PropsWithChildren<ConstructorParameters<typeof kf.Value>[0] & { inputValue: string }>> = (args) => (
    <Engine engine={newComunicaEngine()}
            queryContext={{sources: [{ type: 'sparql', value: 'https://query.wikidata.org/sparql' }]}}>
        <kf.Input bindings={args.inputValue}>
            <kf.Value {...args}/>
        </kf.Input>
    </Engine>
);

// Basic variant of our component
const ValueBasic = ValueTemplate.bind({});
ValueBasic.args = {
  inputValue: '"ciccio"',
//   path: 'rdfs:label'
};

export default meta;
export { ValueBasic };