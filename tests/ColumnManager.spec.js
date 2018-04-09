/* eslint-disable no-undef */
import React from 'react';
import ColumnManager from '../src/ColumnManager';
import Column from '../src/Column';
import ColumnGroup from '../src/ColumnGroup';

describe('ColumnManager', () => {
  describe('groupedColumns', () => {
    it('add appropriate rowspan and colspan to column', () => {
      const columns = [
        { title: '表头A', className: 'title-a', dataIndex: 'a', key: 'a' },
        { title: '表头B', className: 'title-b', dataIndex: 'b', key: 'b' },
        {
          title: '表头C',
          className: 'title-c',
          children: [
            { title: '表头D', className: 'title-d', dataIndex: 'c', key: 'c' },
            {
              title: '表头E',
              className: 'title-e',
              children: [
                { title: '表头F', className: 'title-f', dataIndex: 'd', key: 'd' },
                {
                  title: '表头G',
                  className: 'title-g',
                  children: [
                    { title: '表头H', className: 'title-h', dataIndex: 'e', key: 'e' },
                    { title: '表头I', className: 'title-i', dataIndex: 'f', key: 'f' },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: '表头J',
          className: 'title-j',
          children: [
            { title: '表头K', className: 'title-k', dataIndex: 'g', key: 'g' },
            { title: '表头L', className: 'title-l', dataIndex: 'h', key: 'h' },
          ],
        },
        { title: '表头M', className: 'title-m', dataIndex: 'i', key: 'i' },
      ];

      const columnManager = new ColumnManager(columns);
      const groupedColumns = columnManager.groupedColumns();

      expect(groupedColumns).toEqual([
        { title: '表头A', className: 'title-a', dataIndex: 'a', key: 'a', rowSpan: 4 },
        { title: '表头B', className: 'title-b', dataIndex: 'b', key: 'b', rowSpan: 4 },
        {
          title: '表头C',
          className: 'title-c',
          children: [
            { title: '表头D', className: 'title-d', dataIndex: 'c', key: 'c', rowSpan: 3 },
            {
              title: '表头E',
              className: 'title-e',
              children: [
                { title: '表头F', className: 'title-f', dataIndex: 'd', key: 'd', rowSpan: 2 },
                {
                  title: '表头G',
                  className: 'title-g',
                  children: [
                    { title: '表头H', className: 'title-h', dataIndex: 'e', key: 'e' },
                    { title: '表头I', className: 'title-i', dataIndex: 'f', key: 'f' },
                  ],
                  colSpan: 2,
                },
              ],
              colSpan: 3,
            },
          ],
          colSpan: 4,
        },
        {
          title: '表头J',
          className: 'title-j',
          children: [
            { title: '表头K', className: 'title-k', dataIndex: 'g', key: 'g', rowSpan: 3 },
            { title: '表头L', className: 'title-l', dataIndex: 'h', key: 'h', rowSpan: 3 },
          ],
          colSpan: 2,
        },
        { title: '表头M', className: 'title-m', dataIndex: 'i', key: 'i', rowSpan: 4 },
      ]);
    });
  });

  describe('normalize', () => {
    it('normalize React elements to columns', () => {
      const elements = [
        <ColumnGroup title="a">
          <Column title="b" dataIndex="b" key="b" />
          <Column title="c" dataIndex="c" key="c" />
        </ColumnGroup>,
        <Column title="d" dataIndex="d" key="d" />,
      ];

      const columnManager = new ColumnManager(null, elements);

      expect(columnManager.columns).toEqual([
        {
          title: 'a',
          children: [
            {
              title: 'b',
              dataIndex: 'b',
              key: 'b',
            },
            {
              title: 'c',
              dataIndex: 'c',
              key: 'c',
            },
          ],
        },
        {
          title: 'd',
          dataIndex: 'd',
          key: 'd',
        },
      ]);
    });
  });
});
