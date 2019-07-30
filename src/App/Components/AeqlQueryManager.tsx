import React, { Component, TextareaHTMLAttributes } from 'react';
import { Query } from '../../Aeql/Query';
import { EntityTable } from './EntityTable';
import { AeqlQueryView } from './AeqlQueryView';
import { aeql } from '../Services/Database';
import { HowTo } from './HowTo';
import { Entity } from '../../Aeql/Values';
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
        <HowTo />

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
          <i>SCHEMA</i>
          <h3>PERSONAE</h3>

          {aeql.personae && Object.entries(aeql.personae).map(([name, persona]) => <section className='persona' key={name}>
            <h5>Persona {name}</h5>
            <div>
              {Object.entries(persona).map(([attrName, type]) => <div key={attrName}>
                {attrName} ({type})
                </div>)}</div>
          </section>)}
          <h3>MODELS</h3>

          {aeql.models && Object.entries(aeql.models).map(([name, model]) => <section className='models' key={name}>
            <h5>Model {name}</h5>
            <div>
              {Object.entries(model).map(([attrName, type]) => <div key={attrName}>
                {attrName} ({type})
                </div>)}</div>
          </section>)}

        </section>
      </section>
    </div>;
  }
}
