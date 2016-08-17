import React, { PropTypes } from 'react';
import shallowequal from 'shallowequal';

const ExpandIcon = React.createClass({
  propTypes: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandable: PropTypes.any,
    expanded: PropTypes.bool,
    needIndentSpaced: PropTypes.bool,
    onExpand: PropTypes.func,
  },
  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  },
  render() {
    const { expandable, prefixCls, onExpand, needIndentSpaced, expanded, record } = this.props;
    if (expandable) {
      const expandClassName = expanded ? 'expanded' : 'collapsed';
      return (
        <span
          className={`${prefixCls}-expand-icon ${prefixCls}-${expandClassName}`}
          onClick={(e) => onExpand(!expanded, record, e)}
        />
      );
    } else if (needIndentSpaced) {
      return <span className={`${prefixCls}-expand-icon ${prefixCls}-spaced`} />;
    }
    return null;
  },
});

export default ExpandIcon;
