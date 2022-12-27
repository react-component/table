import type { ColumnsType } from '@/interface';
import Table from 'rc-table';
import React from 'react';
import '../../assets/index.less';

interface FirstTableRecordType {
  time?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  key?: string;
}

const firstTableColumns: ColumnsType<FirstTableRecordType> = [
  { title: '', dataIndex: 'time', key: 'time', rowScope: 'row' },
  { title: 'Monday', dataIndex: 'monday', key: 'monday' },
  { title: 'Tuesday', dataIndex: 'tuesday', key: 'tuesday' },
  { title: 'Wednesday', dataIndex: 'wednesday', key: 'wednesday' },
  { title: 'Thursday', dataIndex: 'thursday', key: 'thursday' },
  { title: 'Friday', dataIndex: 'friday', key: 'friday' },
];

const firstTableData: FirstTableRecordType[] = [
  {
    time: '09:00 - 11:00',
    monday: 'Closed',
    tuesday: 'Open',
    wednesday: 'Open',
    thursday: 'Closed',
    friday: 'Closed',
    key: '1',
  },
  {
    time: '11:00 - 13:00',
    monday: 'Open',
    tuesday: 'Open',
    wednesday: 'Closed',
    thursday: 'Closed',
    friday: 'Closed',
    key: '2',
  },
  {
    time: '13:00 - 15:00',
    monday: 'Open',
    tuesday: 'Open',
    wednesday: 'Open',
    thursday: 'Closed',
    friday: 'Closed',
    key: '3',
  },
  {
    time: '15:00 - 17:00',
    monday: 'Closed',
    tuesday: 'Closed',
    wednesday: 'Closed',
    thursday: 'Open',
    friday: 'Open',
    key: '4',
  },
];

interface SecondTableRecordType {
  posterName?: string;
  color?: string;
  sizesAvailable1?: string;
  sizesAvailable2?: string;
  sizesAvailable3?: string;
  key?: string;
}

const secondTableColumns: ColumnsType<SecondTableRecordType> = [
  {
    title: 'Poster name',
    dataIndex: 'posterName',
    key: 'posterName',
    rowScope: 'rowgroup',
    onCell: (_, index) => {
      const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};

      if (index === 0) {
        props.rowSpan = 3;
      }

      if (index === 3) {
        props.rowSpan = 2;
      }

      if (index === 1 || index === 2 || index === 4) {
        props.rowSpan = 0;
      }

      return props;
    },
  },
  {
    title: 'Color',
    dataIndex: 'color',
    key: 'color',
    rowScope: 'row',
  },
  {
    title: 'Sizes available',
    dataIndex: 'sizesAvailable1',
    colSpan: 3,
    key: 'sizesAvailable1',
  },
  {
    dataIndex: 'sizesAvailable2',
    colSpan: 0,
  },
  {
    dataIndex: 'sizesAvailable3',
    colSpan: 0,
  },
];

const secondTableData: SecondTableRecordType[] = [
  {
    posterName: 'Zodiac',
    color: 'Full color',
    sizesAvailable1: 'A2',
    sizesAvailable2: 'A3',
    sizesAvailable3: 'A4',
    key: '1',
  },
  {
    posterName: 'Zodiac',
    color: 'Black and white',
    sizesAvailable1: 'A1',
    sizesAvailable2: 'A2',
    sizesAvailable3: 'A3',
    key: '2',
  },
  {
    posterName: 'Zodiac',
    color: 'Sepia',
    sizesAvailable1: 'A3',
    sizesAvailable2: 'A4',
    sizesAvailable3: 'A5',
    key: '3',
  },
  {
    posterName: 'Angels',
    color: 'Black and white',
    sizesAvailable1: 'A1',
    sizesAvailable2: 'A3',
    sizesAvailable3: 'A4',
    key: '4',
  },
  {
    posterName: 'Angels',
    color: 'Sepia',
    sizesAvailable1: 'A2',
    sizesAvailable2: 'A3',
    sizesAvailable3: 'A5',
    key: '5',
  },
];

const Demo = () => (
  <div>
    <h2>Scope row</h2>
    <Table<FirstTableRecordType> columns={firstTableColumns} data={firstTableData} />
    <br />
    <h2>Scope rowgroup</h2>
    <Table<SecondTableRecordType> columns={secondTableColumns} data={secondTableData} />
  </div>
);

export default Demo;
