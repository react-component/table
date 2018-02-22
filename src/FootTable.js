import React from "react";
import PropTypes from "prop-types";
import { measureScrollbar } from "./utils";
import BaseTable from "./BaseTable";

export default function FootTable(props, { table }) {
  const { prefixCls, scroll, showFooter } = table.props;
  const {
    columns,
    fixed,
    tableClassName,
    handleBodyScrollLeft,
    expander
  } = props;
  const { saveRef } = table;
  let { useFixedFooter } = table.props;
  const footStyle = {};

  if (scroll.y) {
    useFixedFooter = true;
    // Add negative margin bottom for scroll bar overflow bug
    const scrollbarWidth = measureScrollbar();
    if (scrollbarWidth > 0 && !fixed) {
      footStyle.paddingBottom = `${scrollbarWidth}px`;
    }
  }

  if (!useFixedFooter || !showFooter) {
    return null;
  }

  return (
    <div
      key="footTable"
      ref={fixed ? null : saveRef("footTable")}
      className={`${prefixCls}-footer`}
      style={footStyle}
      onScroll={handleBodyScrollLeft}
    >
      <BaseTable
        tableClassName={tableClassName}
        hasHead={false}
        hasBody={false}
        hasFoot
        fixed={fixed}
        columns={columns}
        expander={expander}
      />
    </div>
  );
}

FootTable.propTypes = {
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  handleBodyScrollLeft: PropTypes.func.isRequired,
  expander: PropTypes.object.isRequired
};

FootTable.contextTypes = {
  table: PropTypes.any
};
