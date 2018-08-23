/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const makeData = () => {
  const data = [];
  let i = 0;
  while (i < 100) {
    data.push({
      // index: `${i}`,
      key: `${i}`,
      dicountPer: `10+${i}`,
      discountAmount: `20+${i}`,
      discountRate: `60+${i}`,
      amount: `30+${i}`,
      taxAmount: `40+${i}`,
      priceTotal: `50+${i}`,
    });
    i += 1;
  }
  return data;
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, data: makeData() };
  }
  columns = [
    {
      title: '折扣率(%)',
      width: 100,
      dataIndex: 'dicountPer',
      key: 'dicountPer',
    },
    {
      title: '折扣额',
      width: 100,
      dataIndex: 'discountAmount',
      key: 'discountAmount',
    },
    { title: '金额', width: 100, dataIndex: 'amount', key: 'amount' },
    {
      title: '税率(%)',
      width: 100,
      dataIndex: 'discountRate',
      key: 'discountRate',
    },
    { title: '税额', width: 100, dataIndex: 'taxAmount', key: 'taxAmount' },
    {
      title: '价税合计',
      width: 100,
      dataIndex: 'priceTotal',
      key: 'priceTotal',
    },
  ];

  loadMoreData = () => {
    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
      setTimeout(() => {
        this.setState({
          loading: false,
          data: [...this.state.data, ...makeData()],
        });
      }, 10000);
    }
  };
  loadMoreContent = () => (
    <div
      style={{
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      loading
    </div>
  );

  render() {
    return (
      <Table
        key="key"
        virtualized={{
          renderNumber: 20,
          redundantNumber: 10,
          loadMoreThreshold: 10,
          loadMore: this.loadMoreData,
          loadingMore: this.state.loading,
          loadingIndicator: this.loadMoreContent(),
          bodyHeight: 300,
        }}
        useFixedHeader
        bordered
        columns={this.columns}
        data={this.state.data}
      />
    );
  }
}

ReactDOM.render(
  <div>
    <h2>virtualized table</h2>
    <Demo />
  </div>,
  document.getElementById('__react-content'),
);
