import React from 'react';

export default class ExpandableRowHeigh extends React.Component {
  constructor(props) {
    super(props);

    this.store = props.store;

    const { expandedRowKeys } = this.store.getState();

    this.state = {
      visible: !!props.parentKey && !!~expandedRowKeys.indexOf(props.parentKey),
    }
  }

  componentDidMount() {
    // only subscribe on child row
    if (this.props.parentKey) {
      this.unsubscribe = this.store.subscribe(() => {
        this.toggleVisible();
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleVisible() {
    const { rowKey, parentKey } = this.props;
    const { expandedRowKeys } = this.store.getState();
    if (~expandedRowKeys.indexOf(parentKey)) {
      this.setState({ visible: true });
    } else if (this.state.visible === true) {
      this.setState({ visible: false });
    }
  }

  render() {
    return this.props.children(this.state.visible);
  }
}
