import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Table, { TableProps } from '../src';
describe('support classNames and styles', () => {
  const columns: TableProps['columns'] = [
    {
      title: 'title1',
      dataIndex: 'a',
      className: 'a',
      key: 'a',
      width: 100,
    },
    {
      title: 'title2',
      dataIndex: 'b',
      className: 'b',
      key: 'b',
      width: 100,
    },
    {
      title: 'title3',
      dataIndex: 'c',
      className: 'c',
      key: 'c',
      width: 200,
    },
    {
      title: 'Operations',
      dataIndex: '',
      className: 'd',
      key: 'd',
      render() {
        return <a href="#">Operations</a>;
      },
    },
  ];

  const data = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
  ];
  const commonTableProps = {
    columns: columns,
    rowClassName: (record, i) => `row-${i}`,
    expandedRowRender: (record) => <p>extra: {record.a}</p>,
    expandedRowClassName: (record, i) => `ex-row-${i}`,
    className: "table",
    title: () => <span>title</span>,
    footer: () => <span>footer</span>,
  };
  it('should support className and style', () => {
    const testClassNames = {
      section: 'test-section',
      header: 'test-header',
      title: 'test-title',
      body: 'test-body',
      footer: 'test-footer',
      content: 'test-content',
      item: 'test-item',
    }
    const testStyles = {
      section: { background: 'red' },
      header: { background: 'blue' },
      title: { background: 'green' },
      body: { background: 'yellow' },
      footer: { background: 'pink' },
      content: { background: 'purple' },
      item: { background: 'orange' },
    }
    const { container } = render(
      <Table
        {...commonTableProps}
        classNames={testClassNames}
        styles={testStyles}
        data={data}
      />
    )
    const section = container.querySelector('.rc-table-container');
    const title = container.querySelector('.rc-table-title');
    const footer = container.querySelector('.rc-table-footer');
    const content = container.querySelector('.rc-table-content');
    const item = container.querySelector('.rc-table-cell');
    expect(section).toHaveClass(testClassNames.section);
    expect(section).toHaveStyle(testStyles.section);
    expect(title).toHaveClass(testClassNames.title);
    expect(title).toHaveStyle(testStyles.title);
    expect(footer).toHaveClass(testClassNames.footer);
    expect(footer).toHaveStyle(testStyles.footer);
    expect(content).toHaveClass(testClassNames.content);
    expect(content).toHaveStyle(testStyles.content);
    expect(item).toHaveClass(testClassNames.item);
    expect(item).toHaveStyle(testStyles.item);

    const { container: scrollContainer } = render(
      <Table
        {...commonTableProps}
        classNames={testClassNames}
        styles={testStyles}
        data={data}
        scroll={{ y: 200 }}
      />
    )
    const header = scrollContainer.querySelector('.rc-table-header');
    const body = scrollContainer.querySelector('.rc-table-body');
    expect(header).toHaveClass(testClassNames.header);
    expect(header).toHaveStyle(testStyles.header);
    expect(body).toHaveClass(testClassNames.body);
    expect(body).toHaveStyle(testStyles.body);
  })
})

