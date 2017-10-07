export default class Expandable {
  apply(plugin) {
    const table = plugin.table;

    plugin.on('renderRow', (record, index, rowProps) => {
      const isRowExpanded = table.isRowExpanded(record, index);
      const expandIconAsCell = fixed !== 'right' ? props.expandIconAsCell : false;
    });

    plugin.on('afterRowRender', (record, rows) => {
      const {
        expandedRowRender,
      } = table.props;

      if (expandedRowContent && isRowExpanded) {
        rows.push(table.getExpandedRow(
          key,
          expandedRowContent,
          subVisible,
          expandedRowClassName(record, i, indent),
          fixed
        ));
      }
    });
  }
}
