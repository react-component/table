
/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import AnimationSource from 'rc-source-loader!../examples/animation';
import ChildrenIndentSource from 'rc-source-loader!../examples/childrenIndent';
import ClassNameSource from 'rc-source-loader!../examples/className';
import ColspanRowspanSource from 'rc-source-loader!../examples/colspan-rowspan';
import ColumnResizeSource from 'rc-source-loader!../examples/column-resize';
import DropdownSource from 'rc-source-loader!../examples/dropdown';
import EllipsisSource from 'rc-source-loader!../examples/ellipsis';
import ExpandedRowRenderSource from 'rc-source-loader!../examples/expandedRowRender';
import ExpandIconSource from 'rc-source-loader!../examples/expandIcon';
import FixedColumnsAutoHeightSource from 'rc-source-loader!../examples/fixedColumns-auto-height';
import FixedColumnsSource from 'rc-source-loader!../examples/fixedColumns';
import FixedColumnsAndHeaderSource from 'rc-source-loader!../examples/fixedColumnsAndHeader';
import FixedColumnsAndHeaderSyncRowHeightSource from 'rc-source-loader!../examples/fixedColumnsAndHeaderSyncRowHeight';
import FixedColumnsWhenResizeSource from 'rc-source-loader!../examples/fixedColumnsWhenResize';
import GroupingColumnsSource from 'rc-source-loader!../examples/grouping-columns';
import HideHeaderSource from 'rc-source-loader!../examples/hide-header';
import JsxSource from 'rc-source-loader!../examples/jsx';
import KeySource from 'rc-source-loader!../examples/key';
import NestedSource from 'rc-source-loader!../examples/nested';
import NoDataSource from 'rc-source-loader!../examples/no-data';
import ReactDndSource from 'rc-source-loader!../examples/react-dnd';
import RowAndCellClickSource from 'rc-source-loader!../examples/rowAndCellClick';
import ScrollXSource from 'rc-source-loader!../examples/scrollX';
import ScrollXYSource from 'rc-source-loader!../examples/scrollXY';
import ScrollYSource from 'rc-source-loader!../examples/scrollY';
import SimpleSource from 'rc-source-loader!../examples/simple';
import StyledComponentsSource from 'rc-source-loader!../examples/styled-components';
import SubTableSource from 'rc-source-loader!../examples/subTable';
import TitleAndFooterSource from 'rc-source-loader!../examples/title-and-footer';
import Animation from '../examples/animation';
import ChildrenIndent from '../examples/childrenIndent';
import ClassName from '../examples/className';
import ColspanRowspan from '../examples/colspan-rowspan';
import ColumnResize from '../examples/column-resize';
import Dropdown from '../examples/dropdown';
import Ellipsis from '../examples/ellipsis';
import ExpandedRowRender from '../examples/expandedRowRender';
import ExpandIcon from '../examples/expandIcon';
import FixedColumnsAutoHeight from '../examples/fixedColumns-auto-height';
import FixedColumns from '../examples/fixedColumns';
import FixedColumnsAndHeader from '../examples/fixedColumnsAndHeader';
import FixedColumnsAndHeaderSyncRowHeight from '../examples/fixedColumnsAndHeaderSyncRowHeight';
import FixedColumnsWhenResize from '../examples/fixedColumnsWhenResize';
import GroupingColumns from '../examples/grouping-columns';
import HideHeader from '../examples/hide-header';
import Jsx from '../examples/jsx';
import Key from '../examples/key';
import Nested from '../examples/nested';
import NoData from '../examples/no-data';
import ReactDnd from '../examples/react-dnd';
import RowAndCellClick from '../examples/rowAndCellClick';
import ScrollX from '../examples/scrollX';
import ScrollXY from '../examples/scrollXY';
import ScrollY from '../examples/scrollY';
import Simple from '../examples/simple';
import StyledComponents from '../examples/styled-components';
import SubTable from '../examples/subTable';
import TitleAndFooter from '../examples/title-and-footer';
import READMECode from '../README.md';
storiesOf('rc-table', module)
.addDecorator(checkA11y) 
.addDecorator(withInfo)
.addDecorator((storyFn, context) => withConsole()(storyFn)(context))
.addDecorator(withViewport())
.add(
  'readMe',
  () => (
    <div
      className="markdown-body entry-content"
      style={{
        padding: 24,
      }}
    >
      <Markdown escapeHtml={false} source={READMECode} />
    </div>
  ),
  {
    source: {
      code: READMECode,
    },
  },
)
.add('animation', () => <Animation />,{
      source: {
        code: AnimationSource,
      },
    })
.add('childrenIndent', () => <ChildrenIndent />,{
      source: {
        code: ChildrenIndentSource,
      },
    })
.add('className', () => <ClassName />,{
      source: {
        code: ClassNameSource,
      },
    })
.add('colspan-rowspan', () => <ColspanRowspan />,{
      source: {
        code: ColspanRowspanSource,
      },
    })
.add('column-resize', () => <ColumnResize />,{
      source: {
        code: ColumnResizeSource,
      },
    })
.add('dropdown', () => <Dropdown />,{
      source: {
        code: DropdownSource,
      },
    })
.add('ellipsis', () => <Ellipsis />,{
      source: {
        code: EllipsisSource,
      },
    })
.add('expandedRowRender', () => <ExpandedRowRender />,{
      source: {
        code: ExpandedRowRenderSource,
      },
    })
.add('expandIcon', () => <ExpandIcon />,{
      source: {
        code: ExpandIconSource,
      },
    })
.add('fixedColumns-auto-height', () => <FixedColumnsAutoHeight />,{
      source: {
        code: FixedColumnsAutoHeightSource,
      },
    })
.add('fixedColumns', () => <FixedColumns />,{
      source: {
        code: FixedColumnsSource,
      },
    })
.add('fixedColumnsAndHeader', () => <FixedColumnsAndHeader />,{
      source: {
        code: FixedColumnsAndHeaderSource,
      },
    })
.add('fixedColumnsAndHeaderSyncRowHeight', () => <FixedColumnsAndHeaderSyncRowHeight />,{
      source: {
        code: FixedColumnsAndHeaderSyncRowHeightSource,
      },
    })
.add('fixedColumnsWhenResize', () => <FixedColumnsWhenResize />,{
      source: {
        code: FixedColumnsWhenResizeSource,
      },
    })
.add('grouping-columns', () => <GroupingColumns />,{
      source: {
        code: GroupingColumnsSource,
      },
    })
.add('hide-header', () => <HideHeader />,{
      source: {
        code: HideHeaderSource,
      },
    })
.add('jsx', () => <Jsx />,{
      source: {
        code: JsxSource,
      },
    })
.add('key', () => <Key />,{
      source: {
        code: KeySource,
      },
    })
.add('nested', () => <Nested />,{
      source: {
        code: NestedSource,
      },
    })
.add('no-data', () => <NoData />,{
      source: {
        code: NoDataSource,
      },
    })
.add('react-dnd', () => <ReactDnd />,{
      source: {
        code: ReactDndSource,
      },
    })
.add('rowAndCellClick', () => <RowAndCellClick />,{
      source: {
        code: RowAndCellClickSource,
      },
    })
.add('scrollX', () => <ScrollX />,{
      source: {
        code: ScrollXSource,
      },
    })
.add('scrollXY', () => <ScrollXY />,{
      source: {
        code: ScrollXYSource,
      },
    })
.add('scrollY', () => <ScrollY />,{
      source: {
        code: ScrollYSource,
      },
    })
.add('simple', () => <Simple />,{
      source: {
        code: SimpleSource,
      },
    })
.add('styled-components', () => <StyledComponents />,{
      source: {
        code: StyledComponentsSource,
      },
    })
.add('subTable', () => <SubTable />,{
      source: {
        code: SubTableSource,
      },
    })
.add('title-and-footer', () => <TitleAndFooter />,{
      source: {
        code: TitleAndFooterSource,
      },
    })
