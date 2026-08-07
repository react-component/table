import { warning } from '@rc-component/util';
import * as React from 'react';
import { INTERNAL_HOOKS } from '../constant';
import type {
  ExpandableConfig,
  ExpandableType,
  ExpandIconProps,
  GetRowKey,
  Key,
  RenderExpandIcon,
  TriggerEventHandler,
} from '../interface';
import type { TableProps } from '../Table';
import { findAllChildrenKeys, renderExpandIcon } from '../utils/expandUtil';
import { getExpandableProps } from '../utils/legacyUtil';

type ExpandAllInfo<RecordType> = Pick<
  ExpandIconProps<RecordType>,
  'expanded' | 'expandable' | 'onClick'
>;

export default function useExpand<RecordType>(
  props: TableProps<RecordType>,
  mergedData: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
): [
  expandableConfig: ExpandableConfig<RecordType>,
  expandableType: ExpandableType,
  expandedKeys: Set<Key>,
  expandIcon: RenderExpandIcon<RecordType>,
  childrenColumnName: string,
  onTriggerExpand: TriggerEventHandler<RecordType>,
  expandAllInfo: ExpandAllInfo<RecordType> | undefined,
] {
  const expandableConfig = getExpandableProps(props);

  const {
    expandIcon,
    expandedRowKeys,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandedRowRender,
    onExpand,
    onExpandAll,
    onExpandedRowsChange,
    childrenColumnName,
    rowExpandable,
    showExpandAll,
  } = expandableConfig;

  const mergedExpandIcon = expandIcon || renderExpandIcon;
  const mergedChildrenColumnName = childrenColumnName || 'children';
  const expandableType = React.useMemo<ExpandableType>(() => {
    if (expandedRowRender) {
      return 'row';
    }
    /* eslint-disable no-underscore-dangle */
    /**
     * Fix https://github.com/ant-design/ant-design/issues/21154
     * This is a workaround to not to break current behavior.
     * We can remove follow code after final release.
     *
     * To other developer:
     *  Do not use `__PARENT_RENDER_ICON__` in prod since we will remove this when refactor
     */
    if (
      (props.expandable &&
        props.internalHooks === INTERNAL_HOOKS &&
        (props.expandable as any).__PARENT_RENDER_ICON__) ||
      mergedData.some(
        record => record && typeof record === 'object' && record[mergedChildrenColumnName],
      )
    ) {
      return 'nest';
    }
    /* eslint-enable */
    return false;
  }, [!!expandedRowRender, mergedData]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys<RecordType>(mergedData, getRowKey, mergedChildrenColumnName);
    }
    return [];
  });
  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const expandableRows = React.useMemo(() => {
    if (!showExpandAll || expandableType !== 'row') {
      return [];
    }

    return mergedData.reduce<{ key: Key; record: RecordType }[]>((rows, record, index) => {
      if (!rowExpandable || rowExpandable(record)) {
        rows.push({
          key: getRowKey(record, index),
          record,
        });
      }
      return rows;
    }, []);
  }, [expandableType, getRowKey, mergedData, rowExpandable, showExpandAll]);

  const allExpanded =
    expandableRows.length > 0 && expandableRows.every(({ key }) => mergedExpandedKeys.has(key));

  const onTriggerExpand: TriggerEventHandler<RecordType> = React.useCallback(
    (record: RecordType) => {
      const key = getRowKey(record, mergedData.indexOf(record));

      let newExpandedKeys: Key[];
      const hasKey = mergedExpandedKeys.has(key);
      if (hasKey) {
        mergedExpandedKeys.delete(key);
        newExpandedKeys = [...mergedExpandedKeys];
      } else {
        newExpandedKeys = [...mergedExpandedKeys, key];
      }

      setInnerExpandedKeys(newExpandedKeys);
      if (onExpand) {
        onExpand(!hasKey, record);
      }
      if (onExpandedRowsChange) {
        onExpandedRowsChange(newExpandedKeys);
      }
    },
    [getRowKey, mergedExpandedKeys, mergedData, onExpand, onExpandedRowsChange],
  );

  const onTriggerExpandAll: React.MouseEventHandler<HTMLElement> = React.useCallback(
    event => {
      event.stopPropagation();
      if (!expandableRows.length) {
        return;
      }

      const nextExpanded = !allExpanded;
      const nextExpandedKeys = new Set(mergedExpandedKeys);

      expandableRows.forEach(({ key }) => {
        if (nextExpanded) {
          nextExpandedKeys.add(key);
        } else {
          nextExpandedKeys.delete(key);
        }
      });

      const keys = [...nextExpandedKeys];
      setInnerExpandedKeys(keys);
      onExpandAll?.(
        nextExpanded,
        expandableRows.map(({ record }) => record),
      );
      onExpandedRowsChange?.(keys);
    },
    [allExpanded, expandableRows, mergedExpandedKeys, onExpandAll, onExpandedRowsChange],
  );

  const expandAllInfo = React.useMemo<ExpandAllInfo<RecordType> | undefined>(
    () =>
      showExpandAll && expandableType === 'row'
        ? {
            expanded: allExpanded,
            expandable: expandableRows.length > 0,
            onClick: onTriggerExpandAll,
          }
        : undefined,
    [allExpanded, expandableRows.length, expandableType, onTriggerExpandAll, showExpandAll],
  );

  // Warning if use `expandedRowRender` and nest children in the same time
  if (
    process.env.NODE_ENV !== 'production' &&
    expandedRowRender &&
    mergedData.some((record: RecordType) => {
      return Array.isArray(record?.[mergedChildrenColumnName]);
    })
  ) {
    warning(false, '`expandedRowRender` should not use with nested Table');
  }

  return [
    expandableConfig,
    expandableType,
    mergedExpandedKeys,
    mergedExpandIcon,
    mergedChildrenColumnName,
    onTriggerExpand,
    expandAllInfo,
  ];
}
