import { FC } from 'react';
import { ITable } from '../lib/parser';

export const Table: FC<{ table: ITable }> = ({ table }) => (
  <table>
    <thead>
      <tr>
        {table.shownCols.map((c) => (
          <th key={c}>{table.header[c]?.w}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {table.rows.map((row, r) => (
        <tr key={r}>
          {table.shownCols.map((c) => (
            <td key={c}>{row[c]?.w}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
