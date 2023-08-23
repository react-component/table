import Table from 'rc-table';
import React, { useState } from 'react';

const EditableCell: React.FC<any> = ({ children, onOpen, _key, ...rest }) => {
  console.log(111, _key);
  return (
    <td {...rest} onClick={() => onOpen(true)}>
      {children}
    </td>
  );
};
export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  open?: boolean;
  onOpen: (open?: boolean) => void;
}

const App: React.FC = () => {
  const [editKey, setEditKey] = useState('');
  return (
    <div>
      <Table
        components={{ body: { cell: EditableCell } }}
        data={[
          { key: '0', name: 'Edward King 0' },
          { key: '1', name: 'Edward King 1' },
          { key: '2', name: 'Edward King 2' },
        ]}
        columns={[
          {
            title: 'name',
            dataIndex: 'name',
            onCell: record => {
              const thisKey = `${record.key}`;
              return {
                _key: record.key,
                onOpen: () => {
                  setEditKey(thisKey);
                },
                open: editKey === thisKey,
              } as any;
            },
            shouldCellUpdate: () => false,
          },
        ]}
      />
    </div>
  );
};

export default App;
