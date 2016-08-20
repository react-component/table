/* eslint-disable no-console,func-names,react/no-multi-comp */
const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

describe('Table with grouping columns', () => {
  const div = document.createElement('div');

  /**
   * +---+---------------+-------+---+
   * |   |       B       |   I   |   |
   * |   +---+---------------+---+   |
   * |   |   |     D     |   |   |   |
   * | A |   +---+-------+   |   | L |
   * |   | C | E |   F   | J | K |   |
   * |   |   |   +---+---+   |   |   |
   * |   |   |   | G | H |   |   |   |
   * +---+---+---+---+---+---+---+---+
   */
  const columns = [
    { title: '表头A', className: 'title-a', dataIndex: 'a', key: 'a' },
    { title: '表头B', className: 'title-b', children:
      [
        { title: '表头C', className: 'title-c', dataIndex: 'b', key: 'b' },
        { title: '表头D', className: 'title-d', children:
          [
            { title: '表头E', className: 'title-e', dataIndex: 'c', key: 'c' },
            { title: '表头F', className: 'title-f', children:
              [
                { title: '表头G', className: 'title-g', dataIndex: 'd', key: 'd' },
                { title: '表头H', className: 'title-h', dataIndex: 'e', key: 'e' },
              ],
            },
          ],
        },
      ],
    },
    { title: '表头I', className: 'title-i', children:
      [
        { title: '表头J', className: 'title-j', dataIndex: 'f', key: 'f' },
        { title: '表头K', className: 'title-k', dataIndex: 'g', key: 'g' },
      ],
    },
    { title: '表头L', className: 'title-l', dataIndex: 'h', key: 'h' },
  ];

  const data = [
    { key: '1', a: 'a1', b: 'b1', c: 'c1' },
    { key: '2', a: 'a2', b: 'b2', c: 'c2' },
    { key: '3', a: 'a3', b: 'b3', c: 'c3' },
  ];

  let node;

  beforeEach(() => {
    ReactDOM.render(
      <Table columns={columns} data={data} />,
      div
    );
    node = $(div);
  });

  it('group columns', () => {
    const cells = {
      'title-a': ['4', undefined],
      'title-b': [undefined, '4'],
      'title-c': ['3', undefined],
      'title-d': [undefined, '3'],
      'title-e': ['2', undefined],
      'title-f': [undefined, '2'],
      'title-g': [undefined, undefined],
      'title-h': [undefined, undefined],
      'title-i': [undefined, '2'],
      'title-j': ['3', undefined],
      'title-k': ['3', undefined],
      'title-l': ['4', undefined],
    };
    Object.keys(cells).forEach(className => {
      const cell = cells[className];
      expect(node.find(`.${className}`).attr('rowspan')).to.be(cell[0]);
      expect(node.find(`.${className}`).attr('colspan')).to.be(cell[1]);
    });
  });
});
