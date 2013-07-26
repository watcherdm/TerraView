View = require "views/base/View"
HeightmapModel = require "models/Heightmap"
TileModel = require "models/Tile"
TileView = require "views/Tile"
utils = require "lib/utils"

module.exports = View.extend "TileMapView",
  {
    create: (viewportModel) ->
      view = @_super()

      view.el = new createjs.Container

      view.model = viewportModel

      view.heightmap = HeightmapModel.create utils.seed, viewportModel.worldChunkWidth, viewportModel.worldChunkHeight, viewportModel.chunkWidth, viewportModel.chunkHeight, viewportModel.maxElevation;

      view.tileModels = @buildTileModels view

      view.tileViews = @buildTileViews view

      _.each view.tileViews, (tileView) -> view.el.addChild tileView.el

      view.el.addChild(tileView.el) for tileView in view.tileViews

      EventBus.addEventListener "!viewport:move", view.drawMap, view

      view

    buildTileViews: (view) ->
      views = []

      _.each view.tileModels, (tileModel) ->
        tileView = TileView.create tileModel

        tileView.el.x = tileModel.x * 16 # TODO no magic numbers
        tileView.el.y = tileModel.y * 16

        views.push tileView

      views

    buildTileModels: (view) ->
      heightmap = view.heightmap
      model = view.model
      heightmapData = heightmap.getArea model.width, model.height, model.x, model.y

      tiles = []

      for y in [0..heightmapData.length - 1]
        for x in [0..heightmapData[y].length - 1]
          tileModel = TileModel.create heightmapData[y][x], x, y

          tiles.push tileModel

      tiles
  }, {
    drawMap: ->
      heightmapData = @heightmap.getArea @model.width, @model.height, @model.x, @model.y

      for y in [0..heightmapData.length - 1]
        for x in [0..heightmapData[y].length - 1]
          tileModel = @tileModels[x + heightmapData[y].length * y]

          tileModel.setIndex heightmapData[y][x]

    dispose: ->
      @heightmap.dispose()

      _.each @tileModels, (tileModel) ->
        tileModel.dispose()

      _.each @tileViews, (tileView) ->
        tileView.dispose()

      EventBus.removeEventListener "!viewport:move", @drawMap, @

      @_super()
  }
