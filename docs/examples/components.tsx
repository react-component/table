import React from 'react';
import Table from 'rc-table';

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

const table = (props: any) => {
  return (
    <>
      <div style={{ background: '#fff' }}>header table</div>
      <table className={props.className}>{props.children}</table>
    </>
  );
};

const Demo = () => {
  return (
    <div>
      <Table
        classNames={{
          body: {
            wrapper: 'test-body-wrapper',
            cell: 'test-body-cell',
            row: 'test-body-row',
          },
          header: {
            wrapper: 'test-header-wrapper',
            cell: 'test-header-cell',
            row: 'test-header-row',
          },
        }}
        components={{ header: { table } }}
        sticky
        columns={[
          { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
          { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
          { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
        ]}
        data={data}
      />
    </div>
  );
};

export default Demo;
