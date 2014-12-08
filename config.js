require.config({
  "packages": {
    "react/0.12.1": {
      "base": "/node_modules/react",
      "main": "react.js"
    },
    "envify/3.2.0": {
      "base": "/node_modules/react/node_modules/envify",
      "main": "index.js"
    },
    "jstransform/7.0.0": {
      "base": "/node_modules/react/node_modules/envify/node_modules/jstransform",
      "main": "src/jstransform"
    },
    "base62/0.1.1": {
      "base": "/node_modules/react/node_modules/envify/node_modules/jstransform/node_modules/base62",
      "main": "base62.js"
    },
    "esprima-fb/7001.1.0-dev-harmony-fb": {
      "base": "/node_modules/react/node_modules/envify/node_modules/jstransform/node_modules/esprima-fb",
      "main": "esprima.js"
    },
    "source-map/0.1.31": {
      "base": "/node_modules/react/node_modules/envify/node_modules/jstransform/node_modules/source-map",
      "main": "./lib/source-map.js"
    },
    "amdefine/0.1.0": {
      "base": "/node_modules/react/node_modules/envify/node_modules/jstransform/node_modules/source-map/node_modules/amdefine",
      "main": "./amdefine.js"
    },
    "through/2.3.6": {
      "base": "/node_modules/react/node_modules/envify/node_modules/through",
      "main": "index.js"
    },
    "jquery/1.11.1": {
      "base": "/node_modules/jquery",
      "main": "dist/jquery.js"
    },
    "simulate-dom-event/1.0.2": {
      "base": "/node_modules/simulate-dom-event",
      "main": "index"
    },
    "expect.js/0.3.1": {
      "base": "/node_modules/expect.js",
      "main": "index"
    }
  }
});