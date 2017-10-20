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
      height,
      saveRowRef: this.saveRowRef,
    });
  }
}

function getRowHeight(state, props) {
  const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = state;
  const { fixed, index, rowKey } = props;

  if (!fixed) {
    return null;
  }


  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey];
  }

  if (fixedColumnsBodyRowsHeight[index]) {
    return fixedColumnsBodyRowsHeight[index];
  }

  return null;
}

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props),
  };
})(ExpandedRowHeigh)
