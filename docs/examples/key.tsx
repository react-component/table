import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const CheckBox = ({ id }) => (
  <label>
    <input type="checkbox" />
    {id}
  </label>
);

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d?: number;
}

interface DemoProps {
  data: RecordType[];
}

interface DemoState {
  data: RecordType[];
}

class Demo extends React.Component<DemoProps, DemoState> {
  constructor(props: DemoProps) {
    super(props);

    this.state = {
      data: props.data,
    };
  }

  remove(index) {
    this.setState(({ data }) => {
      data.splice(index, 1);
      return {
        data,
      };
    });
  }

  handleClick = index => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.remove(index);
  };

  renderAction = (o, row, index) => (
    <a href="#" onClick={this.handleClick(index)}>
      Delete
    </a>
  );

  render() {
    const { state } = this;
    const columns = [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100, render: a => <CheckBox id={a} /> },
      { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      { title: 'Operations', dataIndex: '', key: 'x', render: this.renderAction },
    ];
    return (
      <Table columns={columns} data={state.data} className="table" rowKey={record => record.a} />
    );
  }
}

const data: RecordType[] = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];

const Test = () => (
  <div>
    <h2>specify key</h2>
    <Demo data={data} />
  </div>
);

export default Test;
