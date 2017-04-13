import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Column extends Component {
  static propTypes = {
    className: PropTypes.string,
    colSpan: PropTypes.number,
    title: PropTypes.node,
    dataIndex: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    fixed: PropTypes.oneOf([
      true,
      'left',
      'right',
    ]),
    render: PropTypes.func,
    onCellClick: PropTypes.func,
  }
}
