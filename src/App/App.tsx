import React from 'react';
import './App.scss';
import { AeqlQueryManager } from './Components/AeqlQueryManager';

const AeqlText = () =>  {
  return (<span className='Aeql-name' style={{ color: '#aeeaea', textShadow: '1.2px 1.2px #aeaeae', fontSize: '135%', fontWeight: 'bolder' }}>
    aeql
  </span>);
}

const App: React.FC = () => {
  return (
      <div className="App">
        <header className="App-header">
          <h1>aeql-lang</h1>
        </header>
        <div className="App-wrapper">
          <main className="App-main">
            <section className='Welcome Card' style={{ backgroundColor: '#fafaf3' }}>
              <h1>let's learn all about <AeqlText />!</h1>
              <ul>
                <li>naturalism</li>
                <li>human values</li>
                <li>categoreal design</li>
              </ul>
              <code>find humans who are awesome</code>
            </section>

            <section className='QueryManager Card'>
              <AeqlQueryManager />
            </section>
          </main>
        </div>
      </div>
  );
}

export default App;
