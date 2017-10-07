export default class Plugin {
  plugins = {};

  constructor(table, plugins = []) {
    this.table = table;

    plugins.forEach(plugin => {
      plugin.apply(this);
    });
  }

  apply(action, ...args) {
    if (this.plugins[action]) {
      this.plugins[action].forEach(callback => {
        callback.call(null, ...args);
      });
    }
  }

  on(action, callback) {
    this.plugins[action] = this.plugins[action] || [];
    this.plugins[action].push(callback);
  }
}
