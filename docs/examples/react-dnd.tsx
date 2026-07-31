/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { TableProps } from '@rc-component/table';
import Table from '@rc-component/table';
import '../../assets/index.less';

// eslint-disable-next-line @babel/no-unused-expressions
createGlobalStyle`
  tr.drop-over-downward td {
    border-bottom: 2px dashed red;
  }
  tr.drop-over-upward td {
    border-top: 2px dashed red;
  }
`;

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
  return null;
}

const BodyRow = props => {
  const {
    moveRow,
    ...restProps
  } = props;
  const ref = React.useRef<HTMLTableRowElement>(null);
  const style = { cursor: 'move' };
  const [{ isOver, sourceClientOffset }, drop] = useDrop({
    accept: 'row',
    drop(item: { index: number }) {
      const dragIndex = item.index;
      const hoverIndex = restProps.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      sourceClientOffset: monitor.getSourceClientOffset(),
    }),
  });
  const [{ dragRow, clientOffset, initialClientOffset }, drag] = useDrag({
    type: 'row',
    item: { index: restProps.index },
    collect: monitor => ({
      dragRow: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
      initialClientOffset: monitor.getInitialClientOffset(),
    }),
  });

  drag(drop(ref));

  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset,
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return <tr ref={ref} {...restProps} className={className} style={style} />;
};

const columns: TableProps['columns'] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render() {
      return <a href="#">Operations</a>;
    },
  },
];

class Demo extends React.Component {
  state = {
    data: [
      { a: '123', key: '1' },
      { a: 'cdd', b: 'edd', key: '2' },
      { a: '1333', c: 'eee', d: 2, key: '3' },
    ],
  };

  components = {
    body: {
      row: BodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(prevState =>
      update(prevState, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),
    );
  };

  render() {
    return (
      <Table
        columns={columns}
        data={this.state.data}
        components={this.components}
        onRow={(record, index) =>
          ({
            index,
            moveRow: this.moveRow,
          }) as any
        }
      />
    );
  }
}

const Test = () => (
  <DndProvider backend={HTML5Backend}>
    <div>
      <h2>Integrate with react-dnd</h2>
      <Demo />
    </div>
  </DndProvider>
);

export default Test;
/* eslint-enable */
