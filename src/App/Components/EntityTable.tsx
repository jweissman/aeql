import React from 'react';
import capitalism from "../../Aeql/util/capitalism";
import { Entity } from "../../Aeql/Aeql";
import './EntityTable.scss';

export const EntityTable: React.FC<{ collectionName?: string, models: Entity[] }> = (props) => {
  let { models } = props;
  return <section className='EntityTable'> 
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
              {value}
            </td>
          )}
        </>
        </tr>)}
      </tbody>
    </table>
  </section>
}