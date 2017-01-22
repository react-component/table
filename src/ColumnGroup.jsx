import { Component, PropTypes } from 'react';

export default class ColumnGroup extends Component {
  static propTypes = {
    title: PropTypes.node,
  }

  static isTableColumnGroup = true
}
