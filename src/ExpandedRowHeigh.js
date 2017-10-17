import React from 'react';
import { connect } from 'mini-store';

class ExpandedRowHeigh extends React.Component {
  componentDidMount() {
    this.setHeight();
  }

  setHeight() {
    const { store, fixed, rowKey } = this.props;
    if (!fixed) {
      const { expandedRowsHeight } = store.getState();
      const height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight[rowKey] = height;
      store.setState({ expandedRowsHeight });
    }
  }

  saveRowRef = (node) => {
    this.rowRef = node;
  }

  render() {
    const { children, height } = this.props;
    return children({
      heigh: height,
      saveRowRef: this.saveRowRef,
    });
  }
}

export default connect(({ expandedRowsHeight }, { fixed, height, rowKey }) => {
  if (fixed && expandedRowsHeight[rowKey]) {
    return { height: expandedRowsHeight[rowKey] }
  }
  return { height };
})(ExpandedRowHeigh)
