import { Dispatch, FC, SetStateAction } from 'react';
import { ITable } from '../lib/parser';

export const Selector: FC<{
  table: ITable;
  setTable: Dispatch<SetStateAction<ITable | undefined>>;
}> = ({ table, setTable }) => (
  <ul>
    {table.header.map((h, i) => {
      const uuid = crypto.randomUUID();
      return (
        <li key={i}>
          <input
            type="checkbox"
            id={uuid}
            checked={table.headerChecks[i]}
            onChange={({ target: { checked } }) => {
              setTable((value) => {
                if (value == null) {
                  return value;
                }
                const headerChecks = value.headerChecks.map((v, j) => (j === i ? checked : v));
                const shownCols = headerChecks.reduce<number[]>((s, v, j) => (v ? [...s, j] : s), []);
                return {
                  ...value,
                  headerChecks,
                  shownCols
                };
              });
            }}
          />
          <label htmlFor={uuid}>{h?.w}</label>
        </li>
      );
    })}
  </ul>
);
