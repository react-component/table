import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ColumnGroup extends Component {
  static propTypes = {
    title: PropTypes.node,
  }

  static isTableColumnGroup = true
}
