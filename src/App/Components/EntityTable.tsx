import React from 'react';
import capitalism from "../../Aeql/util/capitalism";
import { Entity } from "../../Aeql/Aeql";
import './EntityTable.scss';

export const EntityTable: React.FC<{ collectionName?: string, models: Entity[] }> = (props) => {
  let { models } = props;
  if (!models.length) {
    return <p>Nothing.</p>
  }
  return <section className='EntityTable'> 
    <h3>{props.collectionName}</h3>
    <table>
      <thead>
        <tr>
          {Object.entries(models[0]).map(([attr, val]) => <th key={attr}>
            {capitalism.capitalize(attr)}
          </th>)}
        </tr>
      </thead>
      <tbody>
        {models.map(model => <tr key={model.id}><>
          {Object.entries(model).map(
            ([attr, value]) => <td key={attr}>
              {!(value instanceof Object) ? value : "[object]"}
            </td>
          )}
        </>
        </tr>)}
      </tbody>
    </table>
  </section>
}