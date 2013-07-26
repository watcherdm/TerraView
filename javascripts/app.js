(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, StageView;

StageView = require("views/Stage");

module.exports = Application = (function() {
  function Application() {}

  Application.prototype.initialize = function() {
    var canvasEl;
    canvasEl = document.getElementById("main-canvas");
    StageView.create(canvasEl);
    return document.onkeydown = this.onKeyDown;
  };

  Application.prototype.onKeyDown = function(event) {
    return EventBus.dispatch("!key:down", this, event);
  };

  return Application;

})();

});

require.register("initialize", function(exports, require, module) {
var Application;

Application = require('application');

window.onload = function() {
  return (new Application).initialize();
};

});

require.register("lib/utils", function(exports, require, module) {
var utils;

module.exports = utils = {
  seed: +(new Date),
  clamp: function(index, size) {
    return (index + size) % size;
  },
  random: function(seed) {
    return new RNG(seed).uniform();
  },
  tileHeightToType: function(height, maxElevation) {
    var type;
    if (height / maxElevation >= 0.5) {
      type = 1;
    } else {
      type = 0;
    }
    return type;
  }
};

});

require.register("models/Heightmap", function(exports, require, module) {
var HeightmapChunkModel, Model, utils;

Model = require("models/base/Model");

utils = require("lib/utils");

HeightmapChunkModel = require("models/HeightmapChunk");

module.exports = Model.extend("HeightmapModel", {
  create: function(seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation) {
    var model;
    model = this._super();
    model.worldTileWidth = worldChunkWidth * chunkWidth;
    model.worldTileHeight = worldChunkHeight * chunkHeight;
    model.chunks = this.buildChunks(seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation, model.worldTileWidth, model.worldTileHeight);
    model.heightmap = this.generateHeightmap(model.chunks, maxElevation);
    model.data = this.processTiles(model.heightmap, model.worldTileWidth, model.worldTileHeight);
    return model;
  },
  processTiles: function(heightmap, xl, yl) {
    var a, b, c, cx, cy, d, data, e, f, g, h, heightmapTile, n, ne, nw, o, s, se, sw, w, x, y, _i, _j, _ref, _ref1;
    data = [];
    cx = function(x) {
      return utils.clamp(x, xl);
    };
    cy = function(y) {
      return utils.clamp(y, yl);
    };
    for (y = _i = 0, _ref = yl - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      data[y] = [];
      for (x = _j = 0, _ref1 = xl - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        n = heightmap[cy(y - 1)][x];
        e = heightmap[y][cx(x + 1)];
        s = heightmap[cy(y + 1)][x];
        w = heightmap[y][cx(x - 1)];
        ne = heightmap[cy(y - 1)][cx(x + 1)];
        se = heightmap[cy(y + 1)][cx(x + 1)];
        sw = heightmap[cy(y + 1)][cx(x - 1)];
        nw = heightmap[cy(y - 1)][cx(x - 1)];
        o = heightmap[y][x];
        if (o === 0) {
          s = 0;
        } else {
          a = n << n * 4;
          b = e << e * 5;
          c = s << s * 6;
          d = w << w * 7;
          e = ne << ne * 0;
          f = se << se * 1;
          g = nw << nw * 3;
          h = sw << sw * 2;
          s = a + b + c + d + e + f + g + h;
        }
        heightmapTile = s;
        data[y][x] = heightmapTile;
      }
    }
    return data;
  },
  generateHeightmap: function(chunks, maxElevation) {
    var cell, cellRow, cells, chunk, chunkRow, cx, cy, heightmap, x, xIndex, y, yIndex, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    heightmap = [];
    for (y = _i = 0, _len = chunks.length; _i < _len; y = ++_i) {
      chunkRow = chunks[y];
      for (x = _j = 0, _len1 = chunkRow.length; _j < _len1; x = ++_j) {
        chunk = chunkRow[x];
        cells = chunk.cells;
        for (cy = _k = 0, _len2 = cells.length; _k < _len2; cy = ++_k) {
          cellRow = cells[cy];
          for (cx = _l = 0, _len3 = cellRow.length; _l < _len3; cx = ++_l) {
            cell = cellRow[cx];
            yIndex = cy + (y * cells.length);
            xIndex = cx + (x * cellRow.length);
            if (heightmap[yIndex] == null) {
              heightmap[yIndex] = [];
            }
            heightmap[yIndex][xIndex] = utils.tileHeightToType(cell, maxElevation);
          }
        }
      }
    }
    return heightmap;
  },
  buildChunks: function(seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation, worldTileWidth, worldTileHeight) {
    var chunks, ne, nw, se, sw, x, y, _i, _j, _ref;
    chunks = [];
    for (y = _i = 0, _ref = worldChunkHeight - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      chunks[y] = [];
      for (x = _j = 0; 0 <= worldChunkWidth ? _j <= worldChunkWidth : _j >= worldChunkWidth; x = 0 <= worldChunkWidth ? ++_j : --_j) {
        nw = utils.random(y * worldTileWidth + x + seed) * maxElevation;
        if (x + 1 === worldChunkWidth) {
          ne = utils.random(y * worldTileWidth + seed) * maxElevation;
        } else {
          ne = utils.random(y * worldTileWidth + x + 1 + seed) * maxElevation;
        }
        if (y + 1 === worldChunkWidth) {
          sw = utils.random(x + seed) * maxElevation;
          if (x + 1 === worldChunkHeight) {
            se = utils.random(seed) * maxElevation;
          } else {
            se = utils.random(x + 1 + seed) * maxElevation;
          }
        } else {
          sw = utils.random((y + 1) * worldTileWidth + seed) * maxElevation;
          if (x + 1 === worldChunkWidth) {
            se = utils.random((y + 1) * worldTileWidth + seed) * maxElevation;
          } else {
            se = utils.random((y + 1) * worldTileWidth + x + 1 + seed) * maxElevation;
          }
        }
        chunks[y][x] = HeightmapChunkModel.create(nw, ne, se, sw, chunkWidth, chunkHeight);
      }
    }
    return chunks;
  }
}, {
  getArea: function(sliceWidth, sliceHeight, centerX, centerY) {
    var data, heightmapData, x, xIndex, xOffset, y, yIndex, yOffset, _i, _j, _ref, _ref1;
    data = [];
    heightmapData = this.data;
    xOffset = sliceWidth >> 1;
    yOffset = sliceHeight >> 1;
    for (y = _i = 0, _ref = sliceHeight - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      data[y] = [];
      for (x = _j = 0, _ref1 = sliceWidth - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        xIndex = utils.clamp(x - xOffset + centerX, this.worldTileWidth);
        yIndex = utils.clamp(y - yOffset + centerY, this.worldTileHeight);
        data[y][x] = heightmapData[yIndex][xIndex];
      }
    }
    return data;
  }
});

});

require.register("models/HeightmapChunk", function(exports, require, module) {
var Model,
  __slice = [].slice;

Model = require("models/base/Model");

module.exports = Model.extend("HeightmapChunkModel", {
  create: function() {
    var args, model;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    model = this._super();
    model.cells = this.bilinearInterpolate.apply(this, args);
    return model;
  },
  bilinearInterpolate: function(nw, ne, se, sw, width, height) {
    var bottomHeight, cellHeight, cells, topHeight, x, xLookup, xStep, y, yStep, _i, _j, _ref, _ref1;
    xLookup = [];
    cells = [];
    for (y = _i = 0, _ref = height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      cells[y] = [];
      yStep = y / (height - 1);
      for (x = _j = 0, _ref1 = width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        if (xLookup[x] != null) {
          xStep = xLookup[x];
        } else {
          xStep = xLookup[x] = x / (width - 1);
        }
        topHeight = nw + xStep * (ne - nw);
        bottomHeight = sw + xStep * (se - sw);
        cellHeight = topHeight + yStep * (bottomHeight - topHeight);
        cells[y][x] = ~~cellHeight;
      }
    }
    return cells;
  }
}, {});

});

require.register("models/Tile", function(exports, require, module) {
var Model;

Model = require("models/base/Model");

module.exports = Model.extend("TileModel", {
  create: function(index, x, y) {
    var model;
    model = this._super();
    model.index = index;
    model.x = x;
    model.y = y;
    return model;
  }
}, {
  setIndex: function(index) {
    if (this.index !== index) {
      this.index = index;
      return this.onChangeIndex();
    }
  },
  setIndexCallback: function(callback) {
    return this.onChangeIndex = callback;
  },
  onChangeIndex: function() {}
});

});

require.register("models/Viewport", function(exports, require, module) {
var Model;

Model = require("models/base/Model");

module.exports = Model.extend("ViewportModel", {
  create: function(x, y, width, height, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation) {
    var model;
    model = this._super();
    model.x = x;
    model.y = y;
    model.width = width;
    model.height = height;
    model.worldChunkWidth = worldChunkWidth;
    model.worldChunkHeight = worldChunkHeight;
    model.chunkWidth = chunkWidth;
    model.chunkHeight = chunkHeight;
    model.maxElevation = maxElevation;
    model.worldTileWidth = chunkWidth * worldChunkWidth;
    model.worldTileHeight = chunkHeight * worldChunkHeight;
    return model;
  }
}, {
  setX: function(x) {
    if (x !== this.x) {
      this.x = x;
      return EventBus.dispatch("!viewport:move", this, x);
    }
  },
  setY: function(y) {
    if (y !== this.y) {
      this.y = y;
      return EventBus.dispatch("!viewport:move", this, y);
    }
  }
});

});

require.register("models/base/Model", function(exports, require, module) {
module.exports = gamecore.DualPooled.extend("Model", {
  getUsedLength: function() {
    return this.getPool().usedList.length();
  }
}, {
  dispose: function() {
    return this.release();
  }
});

});

require.register("views/Stage", function(exports, require, module) {
var View, ViewportModel, ViewportView;

View = require("views/base/View");

ViewportModel = require("models/Viewport");

ViewportView = require("views/Viewport");

module.exports = View.extend("StageView", {
  create: function(canvasEl) {
    var view;
    view = this._super();
    view.el = new createjs.Stage(canvasEl);
    view.viewportModel = ViewportModel.create(0, 0, 30, 20, 8, 8, 8, 8, 10);
    view.viewportView = ViewportView.create(view.viewportModel);
    view.el.addChild(view.viewportView.el);
    view.el.update();
    _.bindAll(view, "onTick");
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", view.onTick);
    return view;
  }
}, {
  onTick: function() {
    return this.el.update();
  },
  dispose: function() {
    createjs.Ticker.removeEventListener("tick", this.onTick);
    this.viewportView.dispose();
    this.viewportModel.dispose();
    return this._super();
  }
});

});

require.register("views/Tile", function(exports, require, module) {
var View;

View = require("views/base/View");

module.exports = View.extend("TileView", {
  create: function(tileModel) {
    var view;
    view = this._super();
    view.model = tileModel;
    view.el = new createjs.Bitmap("images/tileset_terra.png");
    view.model.setIndexCallback(function() {
      return view.setSpritePosition();
    });
    view.setSpritePosition();
    return view;
  }
}, {
  setSpritePosition: function() {
    var index, x, y;
    index = this.model.index;
    x = index % 16;
    y = ~~(index / 16);
    return this.el.sourceRect = new createjs.Rectangle(x * 16, y * 16, 16, 16);
  }
});

});

require.register("views/TileMap", function(exports, require, module) {
var HeightmapModel, TileModel, TileView, View, utils;

View = require("views/base/View");

HeightmapModel = require("models/Heightmap");

TileModel = require("models/Tile");

TileView = require("views/Tile");

utils = require("lib/utils");

module.exports = View.extend("TileMapView", {
  create: function(viewportModel) {
    var tileView, view, _i, _len, _ref;
    view = this._super();
    view.el = new createjs.Container;
    view.model = viewportModel;
    view.heightmap = HeightmapModel.create(utils.seed, viewportModel.worldChunkWidth, viewportModel.worldChunkHeight, viewportModel.chunkWidth, viewportModel.chunkHeight, viewportModel.maxElevation);
    view.tileModels = this.buildTileModels(view);
    view.tileViews = this.buildTileViews(view);
    _.each(view.tileViews, function(tileView) {
      return view.el.addChild(tileView.el);
    });
    _ref = view.tileViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tileView = _ref[_i];
      view.el.addChild(tileView.el);
    }
    EventBus.addEventListener("!viewport:move", view.drawMap, view);
    return view;
  },
  buildTileViews: function(view) {
    var views;
    views = [];
    _.each(view.tileModels, function(tileModel) {
      var tileView;
      tileView = TileView.create(tileModel);
      tileView.el.x = tileModel.x * 16;
      tileView.el.y = tileModel.y * 16;
      return views.push(tileView);
    });
    return views;
  },
  buildTileModels: function(view) {
    var heightmap, heightmapData, model, tileModel, tiles, x, y, _i, _j, _ref, _ref1;
    heightmap = view.heightmap;
    model = view.model;
    heightmapData = heightmap.getArea(model.width, model.height, model.x, model.y);
    tiles = [];
    for (y = _i = 0, _ref = heightmapData.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      for (x = _j = 0, _ref1 = heightmapData[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        tileModel = TileModel.create(heightmapData[y][x], x, y);
        tiles.push(tileModel);
      }
    }
    return tiles;
  }
}, {
  drawMap: function() {
    var heightmapData, tileModel, x, y, _i, _ref, _results;
    heightmapData = this.heightmap.getArea(this.model.width, this.model.height, this.model.x, this.model.y);
    _results = [];
    for (y = _i = 0, _ref = heightmapData.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = heightmapData[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          tileModel = this.tileModels[x + heightmapData[y].length * y];
          _results1.push(tileModel.setIndex(heightmapData[y][x]));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  },
  dispose: function() {
    this.heightmap.dispose();
    _.each(this.tileModels, function(tileModel) {
      return tileModel.dispose();
    });
    _.each(this.tileViews, function(tileView) {
      return tileView.dispose();
    });
    EventBus.removeEventListener("!viewport:move", this.drawMap, this);
    return this._super();
  }
});

});

require.register("views/Viewport", function(exports, require, module) {
var TileMapView, View, utils;

View = require("views/base/View");

TileMapView = require("views/TileMap");

utils = require("lib/utils");

module.exports = View.extend("ViewportView", {
  create: function(viewportModel) {
    var view;
    view = this._super();
    view.model = viewportModel;
    view.el = new createjs.Container;
    view.tileMapView = TileMapView.create(viewportModel);
    view.el.addChild(view.tileMapView.el);
    EventBus.addEventListener("!key:down", view.onKeyDown, view);
    return view;
  }
}, {
  onKeyDown: function(_event, args) {
    var x, y;
    switch (args.keyCode) {
      case 37:
        x = this.model.x - 1;
        x = utils.clamp(x, this.model.worldTileWidth);
        return this.model.setX(x);
      case 38:
        y = this.model.y - 1;
        y = utils.clamp(y, this.model.worldTileHeight);
        return this.model.setY(y);
      case 39:
        x = this.model.x + 1;
        x = utils.clamp(x, this.model.worldTileWidth);
        return this.model.setX(x);
      case 40:
        y = this.model.y + 1;
        y = utils.clamp(y, this.model.worldTileHeight);
        return this.model.setY(y);
    }
  },
  dispose: function() {
    EventBus.removeEventListener("!key:down", this.onKeyDown, this);
    this.tileMapView.dispose();
    return this._super();
  }
});

});

require.register("views/base/View", function(exports, require, module) {
module.exports = gamecore.DualPooled.extend("View", {
  getUsedLength: function() {
    return this.getPool().usedList.length();
  }
}, {
  dispose: function() {
    return this.release();
  }
});

});


//@ sourceMappingURL=app.js.map