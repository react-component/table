import { mount } from 'enzyme';
import React from 'react';
import Table from '../src';

describe('Table with grouping columns', () => {
  it('group columns', () => {
    /**
     * +---+---+---------------+-------+---+
     * |   |   |       C       |   J   |   |
     * |   |   +---+---------------+---+   |
     * |   |   |   |     E     |   |   |   |
     * | A | B |   +---+-------+   |   | M |
     * |   |   | D | F |   G   | K | L |   |
     * |   |   |   |   +---+---+   |   |   |
     * |   |   |   |   | H | I |   |   |   |
     * +---+---+---+---+---+---+---+---+---+
     */
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

    const data = [
      { key: '1', a: 'a1', b: 'b1', c: 'c1', d: 'd1', e: 'e1', f: 'f1', g: 'g1', h: 'h1', i: 'i1' },
      { key: '2', a: 'a2', b: 'b2', c: 'c2', d: 'd2', e: 'e2', f: 'f2', g: 'g2', h: 'h2', i: 'i2' },
      { key: '3', a: 'a3', b: 'b3', c: 'c3', d: 'd3', e: 'e3', f: 'f3', g: 'g3', h: 'h3', i: 'i3' },
    ];
    const wrapper = mount(<Table columns={columns} data={data} />);

    const cells = {
      'title-a': [4, undefined],
      'title-b': [4, undefined],
      'title-c': [undefined, 4],
      'title-d': [3, undefined],
      'title-e': [undefined, 3],
      'title-f': [2, undefined],
      'title-g': [undefined, 2],
      'title-h': [undefined, undefined],
      'title-i': [undefined, undefined],
      'title-j': [undefined, 2],
      'title-k': [3, undefined],
      'title-l': [3, undefined],
      'title-m': [4, undefined],
    };
    Object.keys(cells).forEach(className => {
      const cell = cells[className];
      expect(wrapper.find(`th.${className}`).prop('rowSpan') || 1).toBe(cell[0] || 1);
      expect(wrapper.find(`th.${className}`).prop('colSpan') || 1).toBe(cell[1] || 1);
    });
  });

  it('https://github.com/ant-design/ant-design/issues/4061', () => {
    /**
     * +-------+
     * | A | C |
     * +-------+
     * |   | D |
     * | B +---+
     * |   | E |
     * +---+---+
     */
    const columns = [
      {
        title: 'A',
        children: [
          {
            title: 'B',
            dataIndex: 'b',
            key: 'b',
            className: 'title-b',
          },
        ],
      },
      {
        title: 'C',
        children: [
          {
            title: 'D',
            children: [
              {
                title: 'E',
                dataIndex: 'e',
                key: 'e',
              },
            ],
          },
        ],
      },
    ];

    const wrapper = mount(<Table columns={columns} data={[]} />);
    const titleB = wrapper.find('th.title-b');
    expect(titleB.prop('rowSpan')).toBe(2);
  });

  it('strange layout', () => {
    /**
     * +-------+
     * |   | B |
     * |   +---+
     * | A | C |
     * +   +---+
     * |   |   |
     * +---+---+
     */
    const columns = [
      {
        title: 'A',
        rowSpan: 3,
        className: 'title-a',
      },
      {
        title: 'B',
        children: [
          {
            title: 'C',
          },
        ],
      },
    ];

    const wrapper = mount(<Table columns={columns} data={[]} />);
    const titleA = wrapper.find('th.title-a');
    expect(titleA.prop('rowSpan')).toBe(3);
  });

  it('more strange layout', () => {
    /**
     * +---+---+-----------+-----------+-----------+
     * | A | B |     C     |           |     E     |
     * +---+---+---+-------+     D     +-----------+
     * |       | G |   H   |           |     I     |
     * |       +---+---+---+---+---+---+---+---+---+
     * |   F   |   |   |       |   | N | O | P |   |
     * |       | J | K |   L   | M +---+---+---+ Q |
     * |       |   |   |       |   | R | S | T |   |
     * +-------+---+---+---+---+---+---+---+---+---+
     */

    const columns = [
      {
        title: 'A',
        className: 'title-a',
        colSpan: 1,
        children: [
          {
            title: 'F',
            className: 'title-f',
            colSpan: 2,
            dataIndex: 'F',
            key: 'F',
            onCell: () => ({ colSpan: 2 }),
          },
        ],
      },
      {
        title: 'B',
        className: 'title-b',
        rowSpan: 1,
        onCell: () => ({ colSpan: 0 }),
      },
      {
        title: 'C',
        className: 'title-c',
        children: [
          {
            title: 'G',
            className: 'title-g',
            children: [
              {
                title: 'J',
                className: 'title-j',
                dataIndex: 'J',
                key: 'J',
              },
            ],
          },
          {
            title: 'H',
            className: 'title-h',
            colSpan: 2,
            children: [
              {
                title: 'K',
                className: 'title-k',
                dataIndex: 'K',
                key: 'K',
              },
              {
                title: 'L',
                className: 'title-l',
                colSpan: 2,
                dataIndex: 'L',
                key: 'L',
                onCell: () => ({ colSpan: 2 }),
              },
            ],
          },
        ],
      },
      {
        title: 'D',
        className: 'title-d',
        colSpan: 3,
        rowSpan: 2,
        children: [
          {
            title: 'M',
            className: 'title-m',
            dataIndex: 'M',
            key: 'M',
          },
          {
            title: 'N',
            className: 'title-n',
            children: [
              {
                title: 'R',
                className: 'title-r',
                dataIndex: 'R',
                key: 'R',
              },
            ],
          },
        ],
      },
      {
        title: 'E',
        className: 'title-e',
        children: [
          {
            title: 'I',
            className: 'title-i',
            children: [
              {
                title: 'O',
                className: 'title-o',
                children: [
                  {
                    title: 'S',
                    className: 'title-s',
                    dataIndex: 'S',
                    key: 'S',
                  },
                ],
              },
              {
                title: 'P',
                className: 'title-p',
                children: [
                  {
                    title: 'T',
                    className: 'title-t',
                    dataIndex: 'T',
                    key: 'T',
                  },
                ],
              },
              {
                title: 'Q',
                className: 'title-q',
                dataIndex: 'Q',
                key: 'Q',
              },
            ],
          },
        ],
      },
    ];

    const data = [
      {
        key: '1',
        F: 'F-1',
        J: 'J-1',
        K: 'K-1',
        L: 'L-1',
        M: 'M-1',
        R: 'R-1',
        S: 'S-1',
        T: 'T-1',
        Q: 'Q-1',
      },
      {
        key: '2',
        F: 'F-2',
        J: 'J-2',
        K: 'K-2',
        L: 'L-2',
        M: 'M-2',
        R: 'R-2',
        S: 'S-2',
        T: 'T-2',
        Q: 'Q-2',
      },
    ];

    const wrapper = mount(<Table columns={columns} data={[]} />);
    expect(wrapper.find('.rc-table-placeholder .rc-table-cell').prop('colSpan')).toEqual(11);

    const titleA = wrapper.find('th.title-a');
    expect(titleA.prop('colSpan')).toBe(null);
    expect(titleA.prop('rowSpan')).toBe(null);

    const titleB = wrapper.find('th.title-b');
    expect(titleB.prop('colSpan')).toBe(null);
    expect(titleB.prop('rowSpan')).toBe(null);

    const titleC = wrapper.find('th.title-c');
    expect(titleC.prop('colSpan')).toBe(3);
    expect(titleC.prop('rowSpan')).toBe(null);

    const titleD = wrapper.find('th.title-d');
    expect(titleD.prop('colSpan')).toBe(3);
    expect(titleD.prop('rowSpan')).toBe(2);

    const titleE = wrapper.find('th.title-e');
    expect(titleE.prop('colSpan')).toBe(3);
    expect(titleE.prop('rowSpan')).toBe(null);

    const titleF = wrapper.find('th.title-f');
    expect(titleF.prop('colSpan')).toBe(2);
    expect(titleF.prop('rowSpan')).toBe(3);

    const titleG = wrapper.find('th.title-g');
    expect(titleG.prop('colSpan')).toBe(null);
    expect(titleG.prop('rowSpan')).toBe(null);

    const titleH = wrapper.find('th.title-h');
    expect(titleH.prop('colSpan')).toBe(2);
    expect(titleH.prop('rowSpan')).toBe(null);

    const titleI = wrapper.find('th.title-i');
    expect(titleI.prop('colSpan')).toBe(3);
    expect(titleI.prop('rowSpan')).toBe(null);

    const titleJ = wrapper.find('th.title-j');
    expect(titleJ.prop('colSpan')).toBe(null);
    expect(titleJ.prop('rowSpan')).toBe(2);

    const titleK = wrapper.find('th.title-k');
    expect(titleK.prop('colSpan')).toBe(null);
    expect(titleK.prop('rowSpan')).toBe(2);

    const titleL = wrapper.find('th.title-l');
    expect(titleL.prop('colSpan')).toBe(2);
    expect(titleL.prop('rowSpan')).toBe(2);

    const titleM = wrapper.find('th.title-m');
    expect(titleM.prop('colSpan')).toBe(null);
    expect(titleM.prop('rowSpan')).toBe(2);

    const titleN = wrapper.find('th.title-n');
    expect(titleN.prop('colSpan')).toBe(null);
    expect(titleN.prop('rowSpan')).toBe(null);

    const titleO = wrapper.find('th.title-o');
    expect(titleO.prop('colSpan')).toBe(null);
    expect(titleO.prop('rowSpan')).toBe(null);

    const titleP = wrapper.find('th.title-p');
    expect(titleP.prop('colSpan')).toBe(null);
    expect(titleP.prop('rowSpan')).toBe(null);

    const titleQ = wrapper.find('th.title-q');
    expect(titleQ.prop('colSpan')).toBe(null);
    expect(titleQ.prop('rowSpan')).toBe(2);

    const titleR = wrapper.find('th.title-r');
    expect(titleR.prop('colSpan')).toBe(null);
    expect(titleR.prop('rowSpan')).toBe(null);

    const titleS = wrapper.find('th.title-s');
    expect(titleS.prop('colSpan')).toBe(null);
    expect(titleS.prop('rowSpan')).toBe(null);

    const titleT = wrapper.find('th.title-t');
    expect(titleT.prop('colSpan')).toBe(null);
    expect(titleT.prop('rowSpan')).toBe(null);
  });

  it('hidden column', () => {
    const columns = [
      {
        title: 'A',
      },
      {
        title: 'B',
        hidden: true,
        children: [
          {
            title: 'C',
          },
        ],
      },
      {
        title: 'D',
        children: [
          {
            title: 'E',
            hidden: true,
          },
          {
            title: 'F',
          },
        ],
      },
    ];
    const wrapper = mount(<Table columns={columns} data={[]} />);

    expect(wrapper.find('thead tr').at(0).find('th').at(1).text()).toEqual('D');
    expect(wrapper.find('thead tr').at(1).find('th').at(0).text()).toEqual('F');
  });
});
