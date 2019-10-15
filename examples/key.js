/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const CheckBox = ({ id }) => (
  <label>
    <input type="checkbox" />
    {id}
  </label>
);

CheckBox.propTypes = {
  id: PropTypes.string,
};

class Demo extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
    };
  }

  remove(index) {
    const rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows,
    });
  }

  handleClick = index => () => {
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

const data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];

const Demo = () => (
  <div>
    <h2>specify key</h2>
    <Demo data={data} />
  </div>
);

export default Demo;
