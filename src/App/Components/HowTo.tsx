import React from 'react';
export const HowTo: React.FC = () => <section className="Tips" style={{ backgroundColor: '#e4eae9' }}>
    <h3>how-to</h3>
    <dl>
        <dt>QUERY FORM</dt>
        <dd>
            the most basic form of a query begins
            with <code>find</code> or <code>get</code>&nbsp;
            followed by a model name
          </dd>
        <code>find humans</code>
        <hr />
        <dt>ORDERING</dt>
        <dd>
            you can order by attributes with <code>by</code>&nbsp;
            followed by the attribute name
          </dd>
        <code>find employees by salary</code>
        <hr />
        <dt>SELECTION</dt>
        <dd>pick rows using <code>with</code>, <code>where</code> or <code>whose</code> </dd>
        <code>find humans whose age is 34</code>
        <hr />
        <dt>PROJECTION</dt>
        <dd>pick columns using <code>find ... of</code></dd>
        <code>find name, salary of employees where age is 47</code>
        <hr/>
        <dt>FETCHING</dt>
        <dd>load data with <code>via</code> followed by the path</dd>
        <code>find users whose name is Bret via /users</code>
        <hr/>
        <dt>JOINING</dt>
        <dd>meld table data together with <code>find ... and ...`</code></dd>
        <code>find employees and departments</code>
    </dl>
</section> 