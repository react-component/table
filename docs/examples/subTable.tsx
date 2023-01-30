import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const generateData = () => {
  const temp = [];

  for (let i = 0; i < 100; i += 1) {
    temp.push({
      a: i,
      b: 'bbbb'.repeat(Math.floor(Math.random() * 10)),
      children: [
        {
          a: `${i}_${i}`,
          b: 'test',
          children: [
            {
              a: `${i}_${i}_${i}`,
              b: 'testtest',
            },
            {
              a: `${i}_${i}_${i}_${i}`,
              b: 'testtest',
            },
            {
              a: `${i}_${i}_${i}_${i}_${i}`,
              b: 'testtest',
            },
          ],
        },
      ],
    });
  }

  return temp;
};

const data = generateData();

class Demo extends React.Component {
  handleClick = (record, e) => {
    e.preventDefault();
    console.log(record.a);
  };

  render() {
    const columns = [
      {
        title: 'title1',
        dataIndex: 'a',
        key: 'a',
        width: 100,
        render(text, record, index) {
          return index;
        },
      },
      { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: 'Operations',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <a href="#" onClick={e => this.handleClick(record, e)}>
            click {record.a}
          </a>
        ),
      },
    ];
    return (
      <div>
        <h2>sub table</h2>
        <Table columns={columns} data={data} rowKey={record => record.a} scroll={{ y: 500 }} />
      </div>
    );
  }
}

export default Demo;
