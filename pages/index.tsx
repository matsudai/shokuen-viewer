import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEventHandler, useState } from 'react';
import { Selector } from '../components/Selector';
import { Tab } from '../components/Tab';
import { Table } from '../components/Table';
import { Week } from '../components/Week';
import { ITable, parseXlsx } from '../lib/parser';

const Home: NextPage = () => {
  const [table, setTable] = useState<ITable>();
  const [tab, setTab] = useState<number>(0);

  const handleUpload = (file: File | null | undefined) => {
    if (file != null) {
      parseXlsx(file, table).then(setTable).catch(console.error);
    }
  };

  return (
    <>
      <Head>
        <title>Viewer | Shokuen</title>
        <meta name="description" content="kintai viewer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-w-full min-h-full flex flex-col"
        onDrop={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleUpload(e.dataTransfer.files[0]);
        }}
      >
        <div className="flex-grow-0">
          <input type="file" onChange={({ target: { files } }) => handleUpload(files?.item(0))} />
        </div>
        <div className="flex-grow-0">
          {table && (
            <>
              <nav className="flex flex-row">
                <Tab currentTab={tab} tab={0} setTab={setTab} label="Data" />
                <Tab currentTab={tab} tab={1} setTab={setTab} label="Cols" />
                <Tab currentTab={tab} tab={2} setTab={setTab} label="/Week" />
              </nav>
              <div className="flex-1 w-full">
                {tab === 0 ? (
                  <Table table={table} />
                ) : tab === 1 ? (
                  <Selector table={table} setTable={setTable} />
                ) : tab === 2 ? (
                  <Week table={table} />
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
