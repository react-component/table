import * as React from 'react';
import shallowequal from 'shallowequal';
import { IconExpandEventHandler } from './interface';

export interface ExpandIconProps<ValueType> {
  record?: ValueType;
  prefixCls?: string;
  expandable?: boolean;
  expanded?: boolean;
  needIndentSpaced?: boolean;
  onExpand?: IconExpandEventHandler<ValueType>;
}

export default class ExpandIcon<ValueType> extends React.Component<ExpandIconProps<ValueType>> {
  shouldComponentUpdate(nextProps: ExpandIconProps<ValueType>) {
    return !shallowequal(nextProps, this.props);
  }

  render() {
    const { expandable, prefixCls, onExpand, needIndentSpaced, expanded, record } = this.props;
    if (expandable) {
      const expandClassName = expanded ? 'expanded' : 'collapsed';
      return (
        <span
          className={`${prefixCls}-expand-icon ${prefixCls}-${expandClassName}`}
          onClick={e => onExpand(record, e)}
        />
      );
    }

    if (needIndentSpaced) {
      return <span className={`${prefixCls}-expand-icon ${prefixCls}-spaced`} />;
    }

    return null;
  }
}
