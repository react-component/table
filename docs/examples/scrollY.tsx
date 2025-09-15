import Table, { type Reference } from 'rc-table';
import React from 'react';
import '../../assets/index.less';

const data = [];
for (let i = 0; i < 20; i += 1) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

const Test = () => {
  const tblRef = React.useRef<Reference>(null);
  const [showBody, setShowBody] = React.useState(true);

  const toggleBody = () => {
    setShowBody(!showBody);
  };

  const columns = [
    { title: 'title1', key: 'a', dataIndex: 'a', width: 100 },
    { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
    {
      title: (
        <a onClick={toggleBody} href="#">
          {showBody ? '隐藏' : '显示'}体
        </a>
      ),
      key: 'x',
      width: 200,
      render() {
        return <a href="#">Operations</a>;
      },
    },
  ];

  return (
    <div>
      <h2>scroll body table</h2>
      <button
        onClick={() => {
          tblRef.current?.scrollTo({
            top: 9999,
          });
        }}
      >
        Scroll To End
      </button>
      <button
        onClick={() => {
          tblRef.current?.scrollTo({
            key: 9,
          });
        }}
      >
        Scroll To key 9
      </button>
      <button
        onClick={() => {
          tblRef.current?.scrollTo({
            top: 0,
          });
        }}
      >
        Scroll To top
      </button>
      <button
        onClick={() => {
          tblRef.current?.scrollTo({
            index: 5,
            offset: -10,
          });
        }}
      >
        Scroll To Index 5 + Offset -10
      </button>
      <button
        onClick={() => {
          tblRef.current?.scrollTo({
            key: 6,
            offset: -10,
          });
        }}
      >
        Scroll To Key 6 + Offset -10
      </button>
      <Table
        ref={tblRef}
        columns={columns}
        data={data}
        scroll={{ y: 300 }}
        rowKey={record => record.key}
        onRow={() => ({ style: { backgroundColor: 'red' } })}
      />
      <h3>Column align issue</h3>
      <p>https://github.com/ant-design/ant-design/issues/54889</p>
      <Table columns={columns} data={data} sticky scroll={{ y: 300, x: 2000 }} />
    </div>
  );
};

export default Test;
