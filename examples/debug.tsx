/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from '../src';
import '../assets/index.less';

interface RecordType {
  key: React.Key;
  id: number;
  date: number;
}

let UUID = 0;

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

  const columns = [
    { title: 'ID', key: 'id', dataIndex: 'id', width: 100 },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 200,
      render(timestamp: number, record: RecordType) {
        return (
          <span style={{ color: 'pink' }}>
            {record.id
              .toString(36)
              .substr(4)
              .toUpperCase()}{' '}
            - {new Date(timestamp).toString()}
          </span>
        );
      },
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

  return (
    <div>
      <h2>simple table</h2>
      <button type="button" onClick={addData}>
        Add Row
      </button>
      <Table<RecordType> columns={columns} data={data} />
    </div>
  );
};

export default Demo;
/* eslint-enable */
