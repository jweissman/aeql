import React, { Component, TextareaHTMLAttributes } from 'react';
import { Query } from '../../Aeql/Query';
import { Entity } from '../../Aeql/Aeql';
import { EntityTable } from './EntityTable';
import { AeqlQueryView } from './AeqlQueryView';
import { aeql } from '../Services/Database';
export type QueryState = {
  query: string,
  result: string,
  errors: string,
  resultData: Entity[]
}

export class AeqlQueryManager extends Component<{}, QueryState> {
  state = {
    query: '',
    errors: '',
    result: '',
    resultData: []
  };

  private parseAeql = async (message: string) => {
    let userInput: string = message;
    if (userInput === '') {
      this.setState({ query: '', result: '' })
    } else {
      let result = '';
      let errors = undefined;
      let resultData: Entity[] = [];
      try {
        let q: Query = aeql.interpret(userInput);
        result = q.describe() //`match: ${q.describe()}\n`
        resultData = await aeql.evaluate(q)
      } catch (e) {
        errors = e.message
      }
      this.setState({
        query: userInput,
        result,
        errors,
        resultData,
      });
    }
  };

  public render() {
    return <>
      <h3>query playground</h3>
      <p>answer all your questions here!</p>
      <section style={{ backgroundColor: '#e4eae9' }}>
        <h3>TIPS</h3>
        <dl>
          <dt>QUERY FORM</dt>
          <dd>the basic form of a query begins with <code>find...</code> or <code>get [model-or-persona-name]</code></dd>

          <dt>ORDERING</dt>
          <dd>you can order by attributes with <code>by [attribute name]</code></dd>

          <dt>SELECTION</dt>
          <dd>pick columns like <code>find humans whose age is 100</code></dd>

          <dt>FETCHING</dt>
          <dd>load data with <code>via https(/users)</code></dd>
        </dl>
      </section>
      <section>
        <AeqlQueryView
          initialQuery='find users via /users'
          errors={this.state.errors}
          parseAeql={this.parseAeql}
          result={this.state.result}
          resultData={this.state.resultData}
        >
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
      <section className='SchemaAndDataSet'>
        <b>SCHEMA</b>
        {Object.entries(aeql.personae).map(([name, persona]) => <section className='persona' key={name}>
          <h3>Persona {name}</h3>
          <ul>
            {Object.entries(persona).map(([attrName, type]) => <div key={attrName}>
              {attrName} ({type})
                </div>)}</ul>
        </section>)}
      </section>
    </>;
  }
}
