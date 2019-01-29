import warning from 'warning';

var scrollbarVerticalSize = void 0;
var scrollbarHorizontalSize = void 0;

// Measure scrollbar width for padding body during modal show/hide
var scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px'
};

export function measureScrollbar() {
  var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'vertical';

  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  var isVertical = direction === 'vertical';
  if (isVertical && scrollbarVerticalSize) {
    return scrollbarVerticalSize;
  } else if (!isVertical && scrollbarHorizontalSize) {
    return scrollbarHorizontalSize;
  }
  var scrollDiv = document.createElement('div');
  Object.keys(scrollbarMeasure).forEach(function (scrollProp) {
    scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
  });
  // Append related overflow style
  if (isVertical) {
    scrollDiv.style.overflowY = 'scroll';
  } else {
    scrollDiv.style.overflowX = 'scroll';
  }
  document.body.appendChild(scrollDiv);
  var size = 0;
  if (isVertical) {
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    scrollbarVerticalSize = size;
  } else {
    size = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    scrollbarHorizontalSize = size;
  }

  document.body.removeChild(scrollDiv);
  return size;
}

export function debounce(func, wait, immediate) {
  var timeout = void 0;
  function debounceFunc() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = this;
    // https://fb.me/react-event-pooling
    if (args[0] && args[0].persist) {
      args[0].persist();
    }
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  }
  debounceFunc.cancel = function cancel() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounceFunc;
}

var warned = {};
export function warningOnce(condition, format, args) {
  if (!warned[format]) {
    warning(condition, format, args);
    warned[format] = !condition;
  }
}

export function remove(array, item) {
  var index = array.indexOf(item);
  var front = array.slice(0, index);
  var last = array.slice(index + 1, array.length);
  return front.concat(last);
}

/**
 * Returns only data- and aria- key/value pairs
 * @param {object} props
 */
export function getDataAndAriaProps(props) {
  return Object.keys(props).reduce(function (memo, key) {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      memo[key] = props[key];
    }
    return memo;
  }, {});
}