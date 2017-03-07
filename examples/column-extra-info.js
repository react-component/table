/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const PAGE_STATUS_EDIT = 'EDIT';
const PAGE_STATUS_READ = 'READ';

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations', dataIndex: '', key: 'd', render(text, record, index, context) {
      if (context.state.pageStatus === PAGE_STATUS_EDIT) {
        return <a href="#">Editable</a>;
      }
      return 'ReadOnly';
    },
  },
];

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: PAGE_STATUS_EDIT,
    };
    this.handleSwitchPageStatus = this.handleSwitchPageStatus.bind(this);
  }

  handleSwitchPageStatus() {
    let pageStatus;
    if (this.state.pageStatus === PAGE_STATUS_EDIT) {
      pageStatus = PAGE_STATUS_READ;
    } else {
      pageStatus = PAGE_STATUS_EDIT;
    }
    this.setState({ pageStatus });
  }

  render() {
    return (
      <div>
        <h2>ColumnExtraInfo table</h2>
        <button type="button" onClick={this.handleSwitchPageStatus}>Switch</button>
        <Table columns={columns} data={data} columnExtraInfo={this} />
      </div>
    );
  }
}

ReactDOM.render(
  <List />,
  document.getElementById('__react-content')
);
