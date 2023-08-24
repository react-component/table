import Table from 'rc-table';
import React, { useState } from 'react';

const EditableCell: React.FC<any> = ({ children, onOpen, _key, shouldCellUpdate, ...rest }) => {
  console.log(111, _key);
  return (
    <td {...rest} onClick={() => onOpen(true)}>
      {children}
    </td>
  );
};
// 测试
// const Demo = (props: any) => {
//   const { children, shouldCellUpdate } = props;
//   const dom = useMemo(
//     () => <EditableCell {...props}>{children}</EditableCell>,
//     [children, props],
//     () => shouldCellUpdate(),
//   );

//   return <React.Fragment>{dom}</React.Fragment>;
// };
// 普通
const Demo = (props: any) => {
  const { children } = props;

  return (
    <React.Fragment>
      <EditableCell {...props}>{children}</EditableCell>
    </React.Fragment>
  );
};

const App: React.FC = () => {
  const [editKey, setEditKey] = useState('');
  return (
    <div>
      <Table
        components={{ body: { cell: Demo } }}
        data={[
          { key: '0', name: 'Edward King 0' },
          { key: '1', name: 'Edward King 1' },
          { key: '2', name: 'Edward King 2' },
        ]}
        columns={[
          {
            dataIndex: 'name',
            shouldCellUpdate: () => false,
            onCell: record => {
              const thisKey = `${record.key}`;
              return {
                _key: record.key,
                onOpen: () => {
                  setEditKey(thisKey);
                },
                open: editKey === thisKey,
                // shouldCellUpdate: () => false,
              } as any;
            },
          },
        ]}
      />{' '}
    </div>
  );
};

export default App;
