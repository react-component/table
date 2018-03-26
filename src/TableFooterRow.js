import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';

const FOOTER_ROW_KEY = `rc_table_footer_key_${Date.now()}`;

function getColumnFooter(col) {
  if (typeof col.footer === 'function') return col.footer;
  return () => col.footer;
}

class TableFooterRow extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    components: PropTypes.any,
    prefixCls: PropTypes.string,
    onHover: PropTypes.func,
    hovered: PropTypes.bool,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  handleMouseEnter = () => {
    const { onHover } = this.props;
    if (onHover) {
      onHover(true, FOOTER_ROW_KEY);
    }
  }

  handleMouseLeave = () => {
    const { onHover } = this.props;
    if (onHover) {
      onHover(false, FOOTER_ROW_KEY);
    }
  }

  render() {
    const{ columns, data, components, prefixCls, hovered, height } = this.props;
    const FooterRow = components.footer.row;
    const FooterCell = components.footer.cell;

    let className = `${prefixCls}-footer-row`;
    if (hovered) {
      className += ` ${prefixCls}-row-hover`;
    }

    return (
      <FooterRow
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={className}
        style={{ height }}
      >
        {columns.map(col =>
          <FooterCell
            key={col.key || col.dataIndex}
          >
            {col.footer ? getColumnFooter(col)(data) : null}
          </FooterCell>
        )}
      </FooterRow>
    );
  }
}

function getRowHeight(state, props) {
  const { fixedColumnsFootRowsHeight } = state;
  const { fixed } = props;
  return fixed ? fixedColumnsFootRowsHeight[0] : null;
}

export default connect((state, props) => ({
  hovered: state.currentHoverKey === FOOTER_ROW_KEY,
  height: getRowHeight(state, props),
}))(TableFooterRow);
