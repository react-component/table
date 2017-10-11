import ExpandRow from './ExpandRow';

export default class Expander {
  constructor(table) {
    this.table = table;
  }

  handleRowDestroy = (record, rowIndex) => {
  }

  getRow(fixed, record, index, indent) {
    return new ExpandRow(this.table, this, fixed, record, index, indent);
  }

}
