import { eachWeekOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { FC } from 'react';
import { ITable } from '../lib/parser';

export const Week: FC<{ table: ITable }> = ({ table }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ProjectId</th>
          <th>ProjectName</th>
          {table.weeks.map((_, i) => (
            <th key={i}>{i + 1}w</th>
          ))}
          <th>/month</th>
        </tr>
      </thead>
      <tbody>
        {table.projects.map((project) => (
          <tr key={project.id}>
            <td className="px-2">{project.id}</td>
            <td className="px-2">{project.name}</td>
            {table.weeks.map((week) => (
              <td className="px-2" key={week.getTime()}>
                {table.works.reduce<number | null>(
                  (s, v) => (v.project.id === project.id && v.startOfWeek.getTime() === week.getTime() ? (s ?? 0) + v.hours / 60.0 : s),
                  null
                ) ?? '-'}
              </td>
            ))}
            <td className="px-2">
              {table.works.reduce<number | null>((s, v) => (v.project.id === project.id ? (s ?? 0) + v.hours / 60.0 : s), null) ?? '-'}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={2}>Total</td>
          {table.weeks.map((week) => (
            <td className="px-2" key={week.getTime()}>
              {table.works.reduce<number | null>(
                (s, v) => (v.startOfWeek.getTime() === week.getTime() ? (s ?? 0) + v.hours / 60.0 : s),
                null
              ) ?? '-'}
            </td>
          ))}
          <td>{table.works.reduce<number | null>((s, v) => (s ?? 0) + v.hours / 60.0, null) ?? '-'}</td>
        </tr>
      </tbody>
    </table>
  );
};
