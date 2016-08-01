import React from 'react';

export default ({ expandable, prefixCls, onExpand, needIndentSpaced, expanded, record }) => {
  if (expandable) {
    const expandClassName = expanded ? 'expanded' : 'collapsed';
    return (
      <span
        className={`${prefixCls}-expand-icon ${prefixCls}-${expandClassName}`}
        onClick={() => onExpand(!expanded, record)}
      />
    );
  } else if (needIndentSpaced) {
    return <span className={`${prefixCls}-expand-icon ${prefixCls}-spaced`} />;
  }
  return null;
};
