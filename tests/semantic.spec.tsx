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
    expandedRowRender: record => <p>extra: {record.a}</p>,
    expandedRowClassName: (record, i) => `ex-row-${i}`,
    className: 'table',
    title: () => <span>title</span>,
    footer: () => <span>footer</span>,
  };
  it('should support className and style', () => {
    const testClassNames = {
      section: 'test-section',
      title: 'test-title',
      footer: 'test-footer',
      content: 'test-content',
      item: 'test-item',
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
    };
    const testStyles = {
      section: { background: 'red' },
      title: { background: 'green' },
      footer: { background: 'pink' },
      content: { background: 'purple' },
      item: { fontSize: '19px' },
      body: {
        wrapper: { background: 'cyan' },
        cell: { background: 'lime' },
        row: { background: 'teal' },
      },
      header: {
        wrapper: { background: 'magenta' },
        cell: { background: 'gold' },
        row: { background: 'silver' },
      },
    };
    const { container } = render(
      <Table {...commonTableProps} classNames={testClassNames} styles={testStyles} data={data} />,
    );
    const section = container.querySelector('.rc-table-container');
    const title = container.querySelector('.rc-table-title');
    const footer = container.querySelector('.rc-table-footer');
    const content = container.querySelector('.rc-table-content');
    const item = container.querySelector('.rc-table-cell');
    const headerWrapper = container.querySelector('.rc-table-thead');
    const headerCell = container.querySelector('.rc-table-cell');
    const headerRow = container.querySelector('tr');
    const bodyWrapper = container.querySelector('.rc-table-tbody');
    const bodyCell = container.querySelector('.rc-table-tbody .rc-table-cell');
    const bodyRow = container.querySelector('.rc-table-row');
    expect(section).toHaveClass(testClassNames.section);
    expect(section).toHaveStyle(testStyles.section);
    expect(title).toHaveClass(testClassNames.title);
    expect(title).toHaveStyle(testStyles.title);
    expect(footer).toHaveClass(testClassNames.footer);
    expect(footer).toHaveStyle(testStyles.footer);
    expect(content).toHaveClass(testClassNames.content);
    expect(content).toHaveStyle(testStyles.content);
    expect(item).toHaveClass(testClassNames.item);
    expect(item).toHaveStyle({ fontSize: testStyles.item.fontSize });

    expect(headerWrapper).toHaveClass(testClassNames.header.wrapper);
    expect(headerWrapper).toHaveStyle(testStyles.header.wrapper);
    expect(headerCell).toHaveClass(testClassNames.header.cell);
    expect(headerCell).toHaveStyle({ background: testStyles.header.cell.background });
    expect(headerRow).toHaveClass(testClassNames.header.row);
    expect(headerRow).toHaveStyle(testStyles.header.row);
    expect(bodyWrapper).toHaveClass(testClassNames.body.wrapper);
    expect(bodyWrapper).toHaveStyle(testStyles.body.wrapper);
    expect(bodyCell).toHaveClass(testClassNames.body.cell);
    expect(bodyCell).toHaveStyle(testStyles.body.cell);
    expect(bodyRow).toHaveClass(testClassNames.body.row);
    expect(bodyRow).toHaveStyle(testStyles.body.row);
  });
});
