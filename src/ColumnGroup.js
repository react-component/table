import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ColumnGroup extends Component {
  static isTableColumnGroup = true;
  static propTypes = {
    title: PropTypes.node,
  };
}
