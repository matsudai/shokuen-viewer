import { eachWeekOfInterval, endOfMonth, endOfWeek, parse, startOfMonth, startOfWeek } from 'date-fns';
import * as XLSX from 'xlsx';

const DEFAULT_SHOWN_COLS = [6, 15, 19, 20, 28, 29, 30];

export interface ITable {
  book: XLSX.Sheet;
  sheet: XLSX.Sheet;
  cells: XLSX.CellObject[][];
  rowSize: number;
  colSize: number;
  shownCols: number[];
  headerChecks: boolean[];
  header: XLSX.CellObject[];
  rows: XLSX.CellObject[][];
  weeks: Date[];
  projects: { id: string; name: string }[];
  works: {
    project: { id: string; name: string };
    workType: { id: string; name: string };
    hours: number;
    date: Date;
    startOfWeek: Date;
    endOfWeek: Date;
  }[];
}

const cellAt = (sheet: XLSX.WorkSheet, r: number, c: number) => {
  return sheet[XLSX.utils.encode_cell({ r, c })] as XLSX.CellObject;
};

const scanRowSize = (sheet: XLSX.WorkSheet) => {
  let row = 0;
  let cell = cellAt(sheet, row, 0);
  while (cell != null) {
    row += 1;
    cell = cellAt(sheet, row, 0);
  }
  return row;
};

const scanColSize = (sheet: XLSX.WorkSheet) => {
  let col = 0;
  let cell = cellAt(sheet, 0, col);
  while (cell != null) {
    col += 1;
    cell = cellAt(sheet, 0, col);
  }
  return col;
};

export const parseXlsx = async (file: File, currentValue?: ITable) => {
  const buff = await file.arrayBuffer();
  const book = XLSX.read(buff);
  const sheet = book.Sheets[book.SheetNames[0]];
  const rowSize = scanRowSize(sheet);
  const colSize = scanColSize(sheet);

  const cells = [...Array(rowSize)].map((_, r) => [...Array(colSize)].map((_, c) => cellAt(sheet, r, c)));

  const header = cells[0];
  const rows = cells.slice(1);

  const shownCols = DEFAULT_SHOWN_COLS.filter((c) => c < colSize);
  const headerChecks = [...Array(colSize)].map((_, i) => shownCols.some((v) => v === i));

  // [TODO] Types.
  const works = rows.map((row) => {
    const date = parse(row[6]?.v as string, 'yyyy/MM/dd', new Date());
    return {
      project: {
        id: row[15]?.v as string,
        name: row
          .slice(19, 21)
          .map((v) => v?.v)
          .filter((v) => v != null)
          .join('-') as string
      },
      workType: { id: row[28]?.v as string, name: row[29]?.v as string },
      hours: row[30]?.v as number,
      date,
      startOfWeek: startOfWeek(date),
      endOfWeek: endOfWeek(date)
    };
  });

  const weeks = eachWeekOfInterval({
    start: startOfMonth(works[0].date),
    end: endOfMonth(works[0].date)
  });

  const projects = works.reduce<{ id: string; name: string }[]>(
    (s, v) => (s.some((vv) => vv.id === v.project.id) ? s : [...s, v.project]),
    []
  );

  return {
    book,
    sheet,
    rowSize,
    colSize,
    cells,
    shownCols,
    headerChecks,
    header,
    rows,
    weeks,
    projects,
    works
  };
};
