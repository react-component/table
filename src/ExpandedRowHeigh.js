import React from 'react';

export default class ExpandableRowHeigh extends React.Component {
  constructor(props) {
    super(props);

    this.store = props.store;

    this.state = {
      height: props.height,
    }
  }

  componentDidMount() {
    this.pushHeight();
    this.pullHeight();
    this.unsubscribe = this.store.subscribe(() => {
      this.pullHeight();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  pullHeight() {
    const { fixed, rowKey } = this.props;
    const { expandedRowsHeight } = this.store.getState();
    if (fixed && expandedRowsHeight[rowKey]) {
      this.setState({ height: expandedRowsHeight[rowKey] });
    }
  }

  pushHeight() {
    const { fixed, rowKey } = this.props;
    if (!fixed) {
      const { expandedRowsHeight } = this.store.getState();
      const height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight[rowKey] = height;
      this.store.setState({ expandedRowsHeight });
    }
  }

  saveRowRef = (node) => {
    this.rowRef = node;
  }

  render() {
    return this.props.children({
      heigh: this.state.height,
      saveRowRef: this.saveRowRef,
    });
  }
}
