/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table, { Column, ColumnGroup } from '../src';
import '../assets/index.less';
import { ColumnsType } from '../src/interface';

interface RecordType {
  key: React.Key;
  id: number;
  date: number;
}

let UUID = 0;

function renderDate(timestamp: number, record: RecordType) {
  return (
    <span style={{ color: 'pink' }}>
      {record.id
        .toString(36)
        .substr(4)
        .toUpperCase()}{' '}
      - {new Date(timestamp).toString()}
    </span>
  );
}

const Demo = () => {
  const [data, setData] = React.useState([]);

  function offsetIndex(record: RecordType, offset: number) {
    const index = data.indexOf(record);
    const targetIndex = index + offset;
    const target = data[targetIndex];
    const newData = [...data];
    newData[index] = target;
    newData[targetIndex] = record;

    setData(newData);
  }

  const columns: ColumnsType<RecordType> = [
    { title: 'ID', key: 'id', dataIndex: 'id', width: 100 },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 200,
      render: renderDate,
    },
    {
      title: 'Merged Title',
      children: [
        {
          title: '0 - ID',
          dataIndex: 'id',
        },
        {
          title: '1 - Merge Date',
          children: [
            {
              title: '1 - 0 - ID',
              dataIndex: 'id',
            },
            {
              title: '1 - 1 - Date',
              dataIndex: 'date',
            },
          ],
        },
      ],
    },
    {
      title: 'Operations',
      render(_: null, record: RecordType, index: number) {
        return (
          <div>
            <button
              type="button"
              onClick={() => {
                offsetIndex(record, 1);
              }}
              disabled={index === data.length - 1}
            >
              ⬇
            </button>
            <button
              type="button"
              onClick={() => {
                offsetIndex(record, -1);
              }}
              disabled={index === 0}
            >
              ⬆
            </button>
          </div>
        );
      },
    },
  ];

  const addData = () => {
    setData(originData => {
      UUID += 1000 + Math.floor(Math.random() * 100000);

      const id = Date.now() + UUID;

      return [
        ...originData,
        {
          key: id,
          id,
          date: id,
        },
      ];
    });
  };

  React.useEffect(() => {
    for (let i = 0; i < 3; i += 1) {
      addData();
    }
  }, []);

  const [, forceUpdate] = React.useState();

  return (
    <div>
      <h2>Debug Usage, remove after stable released</h2>
      <button type="button" onClick={addData}>
        Add Row
      </button>
      <Table<RecordType> columns={columns} data={data} />

      <br />

      <Table<RecordType> data={data}>
        <Column dataIndex="id" title="ID" />
        <ColumnGroup title="Merged Title">
          <Column dataIndex="id" title="0 - ID" />
          <Column dataIndex="date" title="1 - Date" />
        </ColumnGroup>
      </Table>

      <br />

      <Table<RecordType> data={data}>
        <Column dataIndex="id" title="ID" />
        <Column dataIndex="id" title="Merged Title" colSpan={2} />
        <Column dataIndex="date" colSpan={0} />
      </Table>

      <Table<RecordType> />

      <button
        type="button"
        onClick={() => {
          forceUpdate(Math.random());
        }}
      >
        Update
      </button>
    </div>
  );
};

export default Demo;
/* eslint-enable */
