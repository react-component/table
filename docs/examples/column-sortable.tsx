import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, rectSwappingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Table from 'rc-table';
import React, { useCallback, useMemo, useState } from 'react';
import 'react-resizable/css/styles.css';
import '../../assets/index.less';
const SortableHeaderCell = props => {
  const { style: styleProps, ...restProps } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id as string,
  });

  const style = {
    ...styleProps,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
  };

  return <th ref={setNodeRef} style={style} {...attributes} {...listeners} {...restProps} />;
};

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
] as const;

const Demo = () => {
  const [columns, setColumns] = useState([
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
    {
      title: 'Operations',
      dataIndex: 'd',
      key: 'd',
      render() {
        return <a href="#">Operations</a>;
      },
    },
  ]);

  const columnsWithSortable = useMemo(() => {
    return columns.map(col => ({
      ...col,
      onHeaderCell: () => ({
        id: col.dataIndex,
      }),
    }));
  }, [columns]);

  const tableProps = useMemo(() => {
    return {
      components: { header: { cell: SortableHeaderCell } },
      columns: columnsWithSortable,
      data,
    };
  }, [columnsWithSortable]);
  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    if (over) {
      setColumns(prevColumns => {
        const activeIndex = prevColumns.findIndex(col => col.dataIndex === active.id);
        const overIndex = prevColumns.findIndex(col => col.dataIndex === over.id);
        if (activeIndex === -1 || overIndex === -1) {
          return prevColumns;
        }
        return arrayMove([...prevColumns], activeIndex, overIndex);
      });
    }
  }, []);
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={columns.map(col => col.dataIndex)} strategy={rectSwappingStrategy}>
        <Table {...tableProps} />;
      </SortableContext>
    </DndContext>
  );
};

export default Demo;
