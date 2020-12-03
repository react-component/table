import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const data = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

const columns = [
  { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
];

function CustomExpandIcon(props) {
  let text;
  if (props.expanded) {
    text = '&#8679; collapse';
  } else {
    text = '&#8681; expand';
  }
  return (
    <a
      className="expand-row-icon"
      onClick={e => {
        props.onExpand(props.record, e);
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: text }}
      style={{ color: 'blue', cursor: 'pointer' }}
    />
  );
}

const onExpand = (expanded, record) => {
  // eslint-disable-next-line no-console
  console.log('onExpand', expanded, record);
};

const Demo = () => (
  <Table
    columns={columns}
    data={data}
    expandable={{
      expandRowByClick: true,
      expandedRowRender: record => <p>extra: {record.a}</p>,
      onExpand,
      expandIcon: CustomExpandIcon,
    }}
  />
);

export default Demo;
