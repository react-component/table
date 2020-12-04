import React from 'react';
import CSSMotionList from 'rc-animate/lib/CSSMotionList';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import Table from 'rc-table';
import '../../assets/index.less';
import './animation.less';

type MotionBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const MotionBody: React.FC<MotionBodyProps> = ({ children, ...props }) => {
  const nodeList = toArray(children);
  const nodesRef = React.useRef<Record<React.Key, React.ReactElement>>({});

  // Better apply clean up logic to avoid OOM
  const keys: React.Key[] = [];
  nodeList.forEach(node => {
    const { key } = node;
    nodesRef.current[key] = node;
    keys.push(key);
  });

  return (
    <tbody {...props}>
      <CSSMotionList keys={keys} component={false} motionName="move">
        {({ key, className }) => {
          const node = nodesRef.current[key];
          return React.cloneElement(node, {
            className: classNames(node.props.className, className),
          });
        }}
      </CSSMotionList>
    </tbody>
  );
};

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  key: React.Key;
}

interface DemoState {
  data: RecordType[];
}

class Demo extends React.Component<{}, DemoState> {
  columns = [
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
    { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
    {
      title: 'Operations',
      dataIndex: '',
      key: 'd',
      render: (text: string, record: RecordType) => (
        <a onClick={e => this.onDelete(record.key, e)} href="#">
          Delete
        </a>
      ),
    },
  ];

  state: DemoState = {
    data: [
      { a: '123', key: '1' },
      { a: 'cdd', b: 'edd', key: '2' },
      { a: '1333', c: 'eee', key: '3' },
    ],
  };

  onDelete = (key: React.Key, e: React.MouseEvent<HTMLElement>) => {
    console.log('Delete', key);
    e.preventDefault();
    this.setState(({ data }) => ({
      data: data.filter(item => item.key !== key),
    }));
  };

  onAdd = () => {
    this.setState(({ data }) => ({
      data: [
        ...data,
        {
          a: 'new data',
          b: 'new data',
          c: 'new data',
          key: Date.now(),
        },
      ],
    }));
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Table row with animation</h2>
        <button type="button" onClick={this.onAdd}>
          添加
        </button>
        <Table
          columns={this.columns}
          data={this.state.data}
          components={{
            body: { wrapper: MotionBody },
          }}
        />
      </div>
    );
  }
}

export default Demo;
