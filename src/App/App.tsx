import React from 'react';
import './App.css';
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
        hello aeql
      </header>
      <main className="App-main">
        <section className='Welcome' style={{ backgroundColor: '#fafaf3'}}>
          <h1>let's learn all about <AeqlText />!</h1>
          <p><AeqlText/>: it's a tiny query language</p>
          <pre>find humans by name</pre>
          {/* <pre>get count(employees), sum(employees.salary) by department</pre> */}
          {/* <pre>find all dinosaurs by average(fossils.date)</pre> */}
          <p>
            <AeqlText/> emphasizes human values, encouraging the description
            of personae in the system
          </p>
          {/* <pre>find employees by name whose job is accountant</pre> */}
        </section>

        <section className='QueryManager'>
          <AeqlQueryManager />
        </section>
      </main>
    </div>
  );
}

export default App;
