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
    return <div>
      <h3>query playground</h3>
      <section className="TipsAndQuery">
      <section className="Tips" style={{ backgroundColor: '#e4eae9' }}>
        <h3>how-to</h3>
        <dl>
          <dt>QUERY FORM</dt>
          <dd>
            the most basic form of a query begins
            with <code>find</code> or <code>get</code>&nbsp;
            followed by a model name
          </dd>
          <code>find humans</code>
          <hr/>
          <dt>ORDERING</dt>
          <dd>
            you can order by attributes with <code>by</code>&nbsp;
            followed by the attribute name
          </dd>
          <code>find employees by salary</code>
          <hr/>
          <dt>SELECTION</dt>
          <dd>pick columns like <code>where home is Panama</code> or <code>whose hair is blonde</code></dd>
          <code>find humans whose age is 34</code>
          <hr/>
          <dt>FETCHING</dt>
          <dd>load data with <code>via /users</code></dd>
          <code>find users whose name is Bret via /users</code>
        </dl>
      </section>
        <AeqlQueryView
          initialQuery='find humans by name'
          errors={this.state.errors}
          parseAeql={this.parseAeql}
          result={this.state.result}
          resultData={this.state.resultData}
        >
        </AeqlQueryView>
      </section>
      <hr/>
      <h4>Playground Data</h4>
      <section className='SchemaAndData'>
        <section className='Data'>
          {aeql.data && Object.entries(aeql.data).map(
            ([collection, models]) => <EntityTable
              key={collection}
              collectionName={collection}
              models={models}
            />
          )}
        </section>
        <section className='Schema'>
          <b>SCHEMA</b>
          {Object.entries(aeql.personae).map(([name, persona]) => <section className='persona' key={name}>
            <h3>Persona {name}</h3>
            <div>
              {Object.entries(persona).map(([attrName, type]) => <div key={attrName}>
                {attrName} ({type})
                </div>)}</div>
          </section>)}
        </section>
      </section>
    </div>;
  }
}
