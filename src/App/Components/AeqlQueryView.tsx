import React from 'react';
import { EntityTable } from './EntityTable';
import { Entity } from '../../Aeql/Values';

export interface QueryViewProps {
  initialQuery?: string;
 errors: string,
 resultData: Entity[],
 parseAeql: Function
 result: string;
}


export class AeqlQueryView extends React.Component<QueryViewProps> {
  textarea: React.RefObject<any>;
  intervalID: number = 0;
  lastValue: string = 'nothing';
  polling: boolean = false;
  constructor(props: QueryViewProps) {
    super(props);
    this.textarea = React.createRef();
  }
  componentDidMount() {
      this.intervalID = window.setInterval(() => {
        if (this.lastValue && this.lastValue != this.textarea.current.value && !this.polling) {
          let val = this.textarea.current.value;
          this.props.parseAeql(val);
          this.lastValue = val;
        }
      }, 150);
  }
  componentWillUnmount() {
      clearInterval(this.intervalID);
  }
  public render() {
    let { resultData } = this.props;
    return <div className='AeqlQuery'>
      <label>
      <textarea id='query' ref={this.textarea} defaultValue={this.props.initialQuery || 'find humans'} />
      </label>
      <section className='Result'>
        <h3>{this.props.result}</h3>
        {this.props.errors && 
          <div style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {this.props.errors.split("\n").map(error => <p key={error}><code>{error}</code></p>)}
          </div> ||

        resultData instanceof Object && <EntityTable models={resultData} />}
      </section>
    </div>;
  }
}
