/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');
require('rc-table/assets/dragList.less');

const closest = function (el, selector, rootNode) {
  rootNode = rootNode || document.body;
  const matchesSelector = el.matches || el.webkitMatchesSelector
        || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    const flagRoot = el === rootNode;
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
      }
      break;
    }
    el = el.parentNode;
  }
  return el;
};

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      data: [
        {
          title: '0',
          content: 'row_0',
          key: '1',
        }, {
          title: '1',
          content: 'row_1',
          key: '2',
        }, {
          title: '2',
          content: 'row_2',
          key: '3',
        }, {
          title: '3',
          content: 'row_3',
          key: '4',
        }, {
          title: '4',
          content: 'row_4',
          key: '5',
        },
      ],
      dragIndex: -1,
      dragedIndex: -1,
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: 'content',
        dataIndex: 'content',
        key: 'content',
      }, {
        title: 'Operates',
        key: 'operate',
        render: (text, record, index) =>
          <span>
            {this.state.dragIndex >= 0
              && this.state.dragIndex !== this.state.dragedIndex
              && index === this.state.dragedIndex
              &&
              <span className={`drag-target-line ${
                        this.state.dragedIndex < this.state.dragIndex
                        ? 'drag-target-top'
                        : ''}`}
              >
              </span>
              || ''
            }
            <a className="drag-handle" draggable="false"
              onMouseDown={this.onMouseDown} href="#"
            >Drag
            </a>
          </span>,
      },
    ];
  }

  onMouseDown(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }

  onDragStart(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = 'move';
      target.parentNode.ondragenter = this.onDragEnter;
      target.parentNode.ondragover = function (ev) {
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      this.setState({ dragIndex, dragedIndex: dragIndex });
    }
  }

  onDragEnter(e) {
    const target = this.getTrNode(e.target);
    this.setState({
      dragedIndex: target
        ? (target.rowIndex - 1)
        : -1,
    });
  }

  onDragEnd(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', false);
      target.ondragstart = null;
      target.ondragend = null;
      target.parentNode.ondragenter = null;
      target.parentNode.ondragover = null;
      this.changeRowIndex();
    }
  }

  getTrNode(target) {
    return closest(target, 'tr', this.refs.dragContainer.tableNode);
  }

  changeRowIndex() {
    const result = {};
    const currentState = this.state;
    result.dragIndex = result.dragedIndex = -1;
    if (currentState.dragIndex >= 0
        && currentState.dragIndex !== currentState.dragedIndex) {
      const { dragIndex, dragedIndex, data } = currentState;
      const item = data.splice(dragIndex, 1)[0];
      data.splice(dragedIndex, 0, item);
      result.data = data;
    }
    this.setState(result);
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Table row with dragging</h2>
        <Table className={ this.state.dragIndex >= 0 && 'dragging-container' || ''}
          ref="dragContainer" columns={this.columns} data={this.state.data}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Demo/>, document.getElementById('__react-content'));
