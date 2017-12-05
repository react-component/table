import React from 'react';
import PropTypes from 'prop-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

function getFooterCells(columns, cells) {
  cells = cells || [];

  columns.forEach(column => {

    const cell = {
      key: column.key,
      className: column.className || '',
      children: column.title,
      column,
    };

    cells.push(cell);

  });

  return cells;
}

function hasFooter(columns) {
  return columns.filter(column => column.renderFooter).length > 0
}

export default function TableFooter(props, { table }) {

  const { columns } = props;

  const cells = getFooterCells(columns);

  if (!hasFooter(columns)) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        {
          cells.map((cell, index) => (
            <td key={index}>
              {cell.column.renderFooter ? cell.column.renderFooter() : ''}
            </td>
          ))
        }
      </tr>
    </tfoot>
  );
}
