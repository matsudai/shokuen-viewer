import { FC } from 'react';

export const Tab: FC<{
  currentTab: number;
  tab: number;
  label: string;
  setTab: (value: number) => void;
}> = ({ currentTab, tab, label, setTab }) => (
  <button
    onClick={() => currentTab !== tab && setTab(tab)}
    className={`py-4 px-6 ${currentTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
  >
    {label}
  </button>
);
