import * as React from 'react';
import { SummaryFooter, SummaryFooterArray, StickyOffsets } from '../interface';
import Cell from '../Cell';
import BodyContext from '../context/BodyContext';
import TableContext from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';

export interface FooterProps<RecordType> {
  stickyOffsets: StickyOffsets;
  children: SummaryFooter<RecordType>;
}

function Footer<RecordType>({ stickyOffsets, children }: FooterProps<RecordType>) {
  let footer: React.ReactNode;

  const { flattenColumns } = React.useContext(BodyContext);
  const { direction } = React.useContext(TableContext);

  if (React.isValidElement(children)) {
    footer = children;
  } else if (Array.isArray(children)) {
    // Move to Body to enhance performance
    const fixedInfoList = flattenColumns.map((column, colIndex) =>
      getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, direction),
    );

    footer = (children as SummaryFooterArray<RecordType>).map((row, index) => {
      return (
        <tr key={index}>
          {row.map((cell, cellIndex) => {
            const fixedInfo = fixedInfoList[cellIndex];

            return (
              <Cell
                className={null}
                component="td"
                key={cellIndex}
                record={null}
                index={index}
                dataIndex={null}
                render={() => cell}
                {...fixedInfo}
              />
            );
          })}
        </tr>
      );
    });
  }

  return <tfoot>{footer}</tfoot>;
}

export default Footer;
