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
      <button onClick={() => tblRef.current?.scrollTo({ top: 0 })}>Top</button>
      <button onClick={() => tblRef.current?.scrollTo({ top: 9999 })}>End</button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9 })}>Key 9</button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'start' })}>
        Key 9 align: start
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'center' })}>
        Key 9 align: center
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'end' })}>
        Key 9 align: end
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'nearest' })}>
        Key 9 align: nearest
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'start', offset: 20 })}>
        Key 9 start offset20
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'center', offset: 20 })}>
        Key 9 center offset20
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'end', offset: 20 })}>
        Key 9 end offset20
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ key: 9, align: 'nearest', offset: 20 })}>
        Key 9 nearest offset20
      </button>
      <button onClick={() => tblRef.current?.scrollTo({ index: 5, offset: 50 })}>
        Index 5 + Offset 50
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
