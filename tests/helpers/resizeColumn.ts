export default function (wrapper, index, resizeInfo) {
  const { columnResizeObserver, columnKey } = wrapper.find('MeasureCell').at(index).props();
  columnResizeObserver.trigger(resizeInfo, columnKey);
}
