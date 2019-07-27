import React, { Component } from 'react';
import { Query } from '../../Aeql/Query';
import Aeql from '../../Aeql';
import { Entity } from '../../Aeql/Aeql';
import { EntityTable } from './EntityTable';

export let aeql = new Aeql({
  personae: {
    Human: {
      name: 'string',
      age: 'int',
    }
  },
  data: {
    Humans: [
      { id: 1, name: 'Zeta',   age: 59 },
      { id: 2, name: 'Bob',    age: 23 },
      { id: 3, name: 'Jim',    age: 19 },
      { id: 4, name: 'Abel',   age: 24 },
      { id: 5, name: 'Sawyer', age: 34 },
    ]
  }
});

class AeqlQueryView extends React.Component<{
  query: string,
  resultData: Entity[],
  parseAeql: Function
}> {
  public render() {
    let { query, parseAeql, resultData } = this.props;
    return <>
      <h3>query playground</h3>
      <p>enter your query here!</p>
      <section style={{backgroundColor: '#e4eae9' }}>
        <p>
          the basic form of a query begins with <code>find...</code> or <code>get [model-or-persona-name]</code>
        </p>
        <p>you can order by attributes with <code>by [attribute name]</code></p>
      </section>
      <label>
        ask aeql anything:
        &nbsp;
      <textarea
        style={{ minWidth: '60vw', minHeight: '20vh'}}
        id='query'
        value={query}
        onChange={(e)=>parseAeql(e.target.value)}
      />
      </label>
      <section className='Result'>
        {this.props.children}
        <h3>result</h3>
        {resultData.length &&
            <EntityTable models={resultData} />
        }
      </section>
      <section className='SchemaAndDataSet'>
        <b>SCHEMA</b>
        {Object.entries(aeql.personae).map(
          ([name, persona]) => <section className='persona' key={name}>
              <h3>Persona {name}</h3>
              <ul>
              {Object.entries(persona).map(
                ([attrName, type]) => <div key={attrName}>
                  {attrName} ({type})
                </div>
              )}</ul>
            </section>
        )}
        </section>
    </>
  }

}

export type QueryState = {
  query: string,
  result: string,
  resultData: Entity[]
}

export class AeqlQueryManager extends Component<{}, QueryState> {
  state = { query: '', result: '', resultData: [] };
  componentDidMount() {
    this.parseAeql('find humans by name')
  }
  private parseAeql = (message: string) => {
    let userInput: string = message;
    if (userInput === '') {
      this.setState({ query: '', result: '' })
    } else {
      let result = '';
      let resultData: Entity[] = [];
      try {
        let q: Query = aeql.interpret(userInput);
        result = `match: ${q.describe()}\n`
        resultData = aeql.evaluate(q)
      } catch (e) {
        result = e.message
      }
      this.setState({
        query: userInput,
        result,
        resultData
      });
    }
  };

  public render() {
    return <>
      <section style={{backgroundColor: '#faf4f7'}}>
        <AeqlQueryView
          parseAeql={this.parseAeql}
          query={this.state.query}
          resultData={this.state.resultData}
        >
          {this.state.result}
        </AeqlQueryView>
      </section>
      <section style={{backgroundColor: '#eaeaf3'}}>
        <b>DATA</b>
        {aeql.data && Object.entries(aeql.data).map(
          ([collection, models]) => <EntityTable
            key={collection}
            collectionName={collection}
            models={models}
          />
        )}
      </section>
    </>;
  }
}
