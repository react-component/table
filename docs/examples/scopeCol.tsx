import type { ColumnsType } from '@/interface';
import Table from 'rc-table';
import '../../assets/index.less';

interface FirstTableRecordType {
  lastName?: string;
  firstName?: string;
  city?: string;
  key?: string;
}

const firstTableColumns: ColumnsType<FirstTableRecordType> = [
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', colScope: 'col' },
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName', colScope: 'col' },
  { title: 'City', dataIndex: 'city', key: 'city', colScope: 'col' },
];

const firstTableData: FirstTableRecordType[] = [
  { lastName: 'Phoenix', firstName: 'Imary', city: 'Henry', key: '1' },
  { lastName: 'Zeki', firstName: 'Rome', city: 'Min', key: '2' },
  { lastName: 'Apirka', firstName: 'Kelly', city: 'Brynn', key: '3' },
];

interface SecondTableRecordType {
  productType?: string;
  producedMars?: string;
  soldMars?: string;
  producedVenus?: string;
  soldVenus?: string;
  key?: string;
}

const secondTableColumns: ColumnsType<SecondTableRecordType> = [
  {
    title: '',
    dataIndex: 'productType',
    key: 'productType',
    rowSpan: 2,
    rowScope: 'row',
  },
  {
    title: 'Mars',
    dataIndex: 'mars',
    key: 'mars',
    colScope: 'colgroup',
    children: [
      { title: 'Produced', dataIndex: 'producedMars', key: 'producedMars', colScope: 'col' },
      { title: 'Sold', dataIndex: 'soldMars', key: 'soldMars', colScope: 'col' },
    ],
  },
  {
    title: 'Venus',
    dataIndex: 'venus',
    key: 'venus',
    colScope: 'colgroup',
    children: [
      { title: 'Produced', dataIndex: 'producedVenus', key: 'producedVenus', colScope: 'col' },
      { title: 'Sold', dataIndex: 'soldVenus', key: 'soldVenus', colScope: 'col' },
    ],
  },
];

const secondTableData: SecondTableRecordType[] = [
  {
    productType: 'Teddy Bears',
    producedMars: '50,000',
    soldMars: '30,000',
    producedVenus: '100,000',
    soldVenus: '80,000',
    key: '1',
  },
  {
    productType: 'Board Games',
    producedMars: '10,000',
    soldMars: '5,000',
    producedVenus: '12,000',
    soldVenus: '9,000',
    key: '2',
  },
];

const Demo = () => (
  <div>
    <h2>Scope col</h2>
    <Table<FirstTableRecordType> columns={firstTableColumns} data={firstTableData} />
    <br />
    <h2>Scope colgroup</h2>
    <Table<SecondTableRecordType> columns={secondTableColumns} data={secondTableData} />
  </div>
);

export default Demo;
