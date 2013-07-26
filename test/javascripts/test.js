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
require.register("test/initialize", function(exports, require, module) {
var test, tests, _i, _len;

tests = ["./utils", "./models/heightmapChunk", "./models/heightmap", "./models/tile", "./models/viewport", "./views/tile", "./views/tileMap", "./views/viewport", "./views/stage"];

for (_i = 0, _len = tests.length; _i < _len; _i++) {
  test = tests[_i];
  require(test);
}

});

require.register("test/models/heightmap", function(exports, require, module) {
var HeightmapModel;

HeightmapModel = require("models/Heightmap");

describe("Model Heightmap", function() {
  beforeEach(function() {
    var chunkHeight, chunkWidth, maxElevation, seed, worldChunkHeight, worldChunkWidth;
    seed = 19870910;
    worldChunkWidth = 3;
    worldChunkHeight = 3;
    chunkWidth = 4;
    chunkHeight = 3;
    maxElevation = 5;
    return this.heightmapModel = HeightmapModel.create(seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation);
  });
  afterEach(function() {
    this.heightmapModel.dispose();
    return expect(HeightmapModel.getUsedLength()).to.equal(0);
  });
  it("should know world tile dimensions", function() {
    expect(this.heightmapModel.worldTileWidth).to.equal(12);
    return expect(this.heightmapModel.worldTileHeight).to.equal(9);
  });
  it("should build chunks and stitch them together", function() {
    expect(this.heightmapModel.chunks[0][0].cells[0][0]).to.equal(0);
    expect(this.heightmapModel.chunks[0][0].cells[2][0]).to.equal(3);
    expect(this.heightmapModel.chunks[0][0].cells[2][3]).to.equal(4);
    expect(this.heightmapModel.chunks[0][0].cells[0][3]).to.equal(2);
    expect(this.heightmapModel.chunks[0][1].cells[0][0]).to.equal(2);
    expect(this.heightmapModel.chunks[0][1].cells[2][0]).to.equal(3);
    expect(this.heightmapModel.chunks[0][1].cells[2][3]).to.equal(1);
    expect(this.heightmapModel.chunks[0][1].cells[0][3]).to.equal(4);
    expect(this.heightmapModel.chunks[1][0].cells[0][0]).to.equal(3);
    expect(this.heightmapModel.chunks[1][0].cells[2][0]).to.equal(3);
    expect(this.heightmapModel.chunks[1][0].cells[2][3]).to.equal(2);
    expect(this.heightmapModel.chunks[1][0].cells[0][3]).to.equal(4);
    expect(this.heightmapModel.chunks[1][1].cells[0][0]).to.equal(4);
    expect(this.heightmapModel.chunks[1][1].cells[2][0]).to.equal(3);
    expect(this.heightmapModel.chunks[1][1].cells[2][3]).to.equal(0);
    return expect(this.heightmapModel.chunks[1][1].cells[0][3]).to.equal(1);
  });
  it("should generate a heightmap", function() {
    expect(this.heightmapModel.heightmap[0][0]).to.equal(0);
    expect(this.heightmapModel.heightmap[5][0]).to.equal(1);
    expect(this.heightmapModel.heightmap[5][7]).to.equal(0);
    return expect(this.heightmapModel.heightmap[0][7]).to.equal(1);
  });
  it("should process tiles to spritesheet indicies", function() {
    expect(this.heightmapModel.data[0][0]).to.equal(0);
    expect(this.heightmapModel.data[5][0]).to.equal(221);
    expect(this.heightmapModel.data[5][7]).to.equal(0);
    return expect(this.heightmapModel.data[0][7]).to.equal(255);
  });
  return it("should get an area", function() {
    var area;
    area = this.heightmapModel.getArea(10, 10, 0, 0);
    expect(area.length).to.equal(10);
    expect(area[0].length).to.equal(10);
    expect(area[0][0]).to.equal(0);
    expect(area[9][0]).to.equal(0);
    expect(area[9][9]).to.equal(249);
    return expect(area[0][9]).to.equal(249);
  });
});

});

require.register("test/models/heightmapChunk", function(exports, require, module) {
var HeightmapChunkModel;

HeightmapChunkModel = require("models/HeightmapChunk");

describe("Model HeightmapChunk", function() {
  beforeEach(function() {
    return this.heightmapChunkModel = HeightmapChunkModel.create();
  });
  afterEach(function() {
    this.heightmapChunkModel.dispose();
    return expect(HeightmapChunkModel.getUsedLength()).to.equal(0);
  });
  it("should have cells", function() {
    return expect(this.heightmapChunkModel.cells).to.not.equal(void 0);
  });
  return it("should do populate it's cells correctly", function() {
    var map;
    this.heightmapChunkModel.dispose();
    this.heightmapChunkModel = HeightmapChunkModel.create(0, 4, 0, 4, 5, 5);
    map = [[0, 1, 2, 3, 4], [1, 1, 2, 2, 3], [2, 2, 2, 2, 2], [3, 2, 2, 1, 1], [4, 3, 2, 1, 0]];
    return expect(this.heightmapChunkModel.cells).to.deep.equal(map);
  });
});

});

require.register("test/models/tile", function(exports, require, module) {
var TileModel;

TileModel = require("models/Tile");

describe("Model Tile", function() {
  beforeEach(function() {
    return this.tileModel = TileModel.create(1, 2, 3);
  });
  afterEach(function() {
    this.tileModel.dispose();
    return expect(TileModel.getUsedLength()).to.equal(0);
  });
  it("should be valid", function() {
    expect(this.tileModel.index).to.equal(1);
    expect(this.tileModel.x).to.equal(2);
    return expect(this.tileModel.y).to.equal(3);
  });
  it("should set index", function() {
    expect(this.tileModel.index).to.equal(1);
    this.tileModel.setIndex(5);
    return expect(this.tileModel.index).to.equal(5);
  });
  return it("should fire a callback when index has changed", function() {
    var eventCallback, eventCalled;
    eventCalled = false;
    eventCallback = function() {
      return eventCalled = true;
    };
    this.tileModel.setIndexCallback(eventCallback);
    this.tileModel.setIndex(5);
    return expect(eventCalled).to.equal(true);
  });
});

});

require.register("test/models/viewport", function(exports, require, module) {
var ViewportModel;

ViewportModel = require("models/Viewport");

describe("Model Viewport", function() {
  beforeEach(function() {
    return this.viewportModel = ViewportModel.create(1, 2, 3, 4, 5, 6, 7, 8, 9);
  });
  afterEach(function() {
    this.viewportModel.dispose();
    return expect(ViewportModel.getUsedLength()).to.equal(0);
  });
  it("should have valid properties", function() {
    expect(this.viewportModel.x).to.equal(1);
    expect(this.viewportModel.y).to.equal(2);
    expect(this.viewportModel.width).to.equal(3);
    expect(this.viewportModel.height).to.equal(4);
    expect(this.viewportModel.worldChunkWidth).to.equal(5);
    expect(this.viewportModel.worldChunkHeight).to.equal(6);
    expect(this.viewportModel.chunkWidth).to.equal(7);
    expect(this.viewportModel.chunkHeight).to.equal(8);
    return expect(this.viewportModel.maxElevation).to.equal(9);
  });
  it("should compute world tile size", function() {
    expect(this.viewportModel.worldTileWidth).to.equal(35);
    return expect(this.viewportModel.worldTileHeight).to.equal(48);
  });
  it("should set x/y", function() {
    expect(this.viewportModel.x).to.equal(1);
    expect(this.viewportModel.y).to.equal(2);
    this.viewportModel.setX(3);
    this.viewportModel.setY(5);
    expect(this.viewportModel.x).to.equal(3);
    return expect(this.viewportModel.y).to.equal(5);
  });
  return it("should fire an event when x/y change", function() {
    var eventCallback, eventCalled;
    eventCalled = false;
    eventCallback = function() {
      return eventCalled = true;
    };
    EventBus.addEventListener("!viewport:move", eventCallback, this);
    this.viewportModel.setX(4);
    expect(eventCalled).to.equal(true);
    return EventBus.removeEventListener(eventCallback, this);
  });
});

});

require.register("test/utils", function(exports, require, module) {
var utils;

utils = require("lib/utils");

describe("Lib Utils", function() {
  it("should clamp", function() {
    expect(utils.clamp(10, 20)).to.equal(10);
    expect(utils.clamp(21, 20)).to.equal(1);
    return expect(utils.clamp(-10, 20)).to.equal(10);
  });
  it("should random", function() {
    return expect(utils.random(20)).to.equal(0.9575093308120967);
  });
  return it("should tileHeightToType", function() {
    expect(utils.tileHeightToType(4, 10)).to.equal(0);
    return expect(utils.tileHeightToType(6, 10)).to.equal(1);
  });
});

});

require.register("test/views/stage", function(exports, require, module) {
var StageView, TileView, ViewportModel, ViewportView;

StageView = require("views/Stage");

ViewportView = require("views/Viewport");

ViewportModel = require("models/Viewport");

TileView = require("views/Tile");

describe("View Stage", function() {
  beforeEach(function() {
    return this.stageView = StageView.create("");
  });
  afterEach(function() {
    this.stageView.dispose();
    expect(StageView.getUsedLength()).to.equal(0);
    expect(ViewportView.getUsedLength()).to.equal(0);
    expect(ViewportModel.getUsedLength()).to.equal(0);
    return expect(TileView.getUsedLength()).to.equal(0);
  });
  it("should use require animation frame", function() {
    return expect(createjs.Ticker.useRAF).to.equal(true);
  });
  return it("should have a viewport view", function() {
    return expect(this.stageView.el.children.length).to.equal(1);
  });
});

});

require.register("test/views/tile", function(exports, require, module) {
var TileModel, TileView;

TileView = require("views/Tile");

TileModel = require("models/Tile");

describe("View Tile", function() {
  beforeEach(function() {
    this.tileModel = TileModel.create(1, 2, 3);
    return this.tileView = TileView.create(this.tileModel);
  });
  afterEach(function() {
    this.tileView.dispose();
    this.tileModel.dispose();
    expect(TileView.getUsedLength()).to.equal(0);
    return expect(TileModel.getUsedLength()).to.equal(0);
  });
  it("should have an el", function() {
    return expect(this.tileView.el).to.not.equal(void 0);
  });
  it("should set sprite sheet position", function() {
    expect(this.tileView.el.sourceRect.x).to.equal(16);
    return expect(this.tileView.el.sourceRect.y).to.equal(0);
  });
  return it("should set sprite position when model index changes", function() {
    expect(this.tileView.el.sourceRect.x).to.equal(16);
    expect(this.tileView.el.sourceRect.y).to.equal(0);
    this.tileModel.setIndex(3);
    expect(this.tileView.el.sourceRect.x).to.equal(48);
    return expect(this.tileView.el.sourceRect.y).to.equal(0);
  });
});

});

require.register("test/views/tileMap", function(exports, require, module) {
var HeightmapModel, TileMapView, TileModel, TileView, ViewportModel, utils;

TileMapView = require("views/TileMap");

HeightmapModel = require("models/Heightmap");

ViewportModel = require("models/Viewport");

TileModel = require("models/Tile");

TileView = require("views/Tile");

utils = require("lib/utils");

describe("View TileMap", function() {
  beforeEach(function() {
    utils.seed = 19870910;
    this.viewportModel = ViewportModel.create(1, 2, 5, 6, 5, 6, 7, 8, 9);
    return this.tileMapView = TileMapView.create(this.viewportModel);
  });
  afterEach(function() {
    this.viewportModel.dispose();
    this.tileMapView.dispose();
    expect(TileMapView.getUsedLength()).to.equal(0);
    expect(HeightmapModel.getUsedLength()).to.equal(0);
    expect(ViewportModel.getUsedLength()).to.equal(0);
    expect(TileModel.getUsedLength()).to.equal(0);
    return expect(TileView.getUsedLength()).to.equal(0);
  });
  it("should have an el", function() {
    return expect(this.tileMapView.el).to.not.equal(void 0);
  });
  it("should have a heightmap", function() {
    return expect(this.tileMapView.heightmap).to.not.equal(void 0);
  });
  it("should have a viewport model", function() {
    return expect(this.tileMapView.heightmap).to.not.equal(void 0);
  });
  it("should populate tile model collection", function() {
    return expect(this.tileMapView.tileModels.length).to.equal(30);
  });
  it("should add tile views to container", function() {
    return expect(this.tileMapView.el.children.length).to.equal(30);
  });
  return it("should redraw when key down event is fired by viewport", function() {
    var tileModels;
    tileModels = this.tileMapView.tileModels;
    expect(tileModels[0].index).to.equal(185);
    this.viewportModel.setX(12);
    return expect(tileModels[0].index).to.equal(255);
  });
});

});

require.register("test/views/viewport", function(exports, require, module) {
var TileMapView, ViewportModel, ViewportView;

ViewportView = require("views/Viewport");

ViewportModel = require("models/Viewport");

TileMapView = require("views/TileMap");

describe("View Viewport", function() {
  beforeEach(function() {
    this.viewportModel = ViewportModel.create(1, 2, 3, 4, 5, 6, 7, 8, 9);
    return this.viewportView = ViewportView.create(this.viewportModel);
  });
  afterEach(function() {
    this.viewportView.dispose();
    this.viewportModel.dispose();
    expect(ViewportView.getUsedLength()).to.equal(0);
    expect(ViewportModel.getUsedLength()).to.equal(0);
    return expect(TileMapView.getUsedLength()).to.equal(0);
  });
  it("should have a model", function() {
    return expect(this.viewportView.model).to.not.equal(void 0);
  });
  it("should have an el", function() {
    return expect(this.viewportView.el).to.not.equal(void 0);
  });
  it("should add a tilemap view as child", function() {
    return expect(this.viewportView.el.children.length).to.equal(1);
  });
  return it("should update viewport model with movement", function() {
    expect(this.viewportModel.x).to.equal(1);
    expect(this.viewportModel.y).to.equal(2);
    EventBus.dispatch("!key:down", {}, {
      keyCode: 37
    });
    expect(this.viewportModel.x).to.equal(0);
    return expect(this.viewportModel.y).to.equal(2);
  });
});

});


//@ sourceMappingURL=test.js.map