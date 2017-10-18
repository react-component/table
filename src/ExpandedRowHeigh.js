import React from 'react';
import { connect } from 'mini-store';

class ExpandedRowHeigh extends React.Component {
  componentDidUpdate() {
    if (!this.props.fixed && this.rowRef && !this.set) {
      this.setHeight();
    }
  }

  setHeight() {
    const { store, rowKey } = this.props;
    const { expandedRowsHeight } = store.getState();
    const height = this.rowRef.getBoundingClientRect().height;
    expandedRowsHeight[rowKey] = height;
    store.setState({ expandedRowsHeight });
    this.set = true;
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
