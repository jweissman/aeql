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
            <p><AeqlText />: it's a tiny query language!</p>
            <code>find humans by name</code>
            <p>
              <AeqlText /> emphasizes human values, encouraging the description
              of personae in the system
            </p>
            <code>find humans where name is Bret</code>
            {/* <code>find employees by name whose job is accountant</code> */}
            <p>
              <AeqlText /> wants to be a good enough query language for humans!
            </p>
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
