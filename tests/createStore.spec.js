const expect = require('expect.js');
const createStore = require('../src/createStore');

describe('createStore', () => {
  it('create with initial state', () => {
    const store = createStore({ a: 1 });
    expect(store.getState()).to.eql({ a: 1 });
  });

  it('setState', () => {
    const store = createStore({ a: 1 });
    store.setState({ a: 2 });
    expect(store.getState()).to.eql({ a: 2 });
  });

  it('subscribe', () => {
    const store = createStore({ a: 1 });
    const unsubscribe = store.subscribe(() => {
      expect(store.getState()).to.eql({ a: 2 });
    });
    store.setState({ a: 2 });
    unsubscribe();
    store.setState({ a: 3 });
  });
});
