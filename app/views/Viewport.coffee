View = require "views/base/View"
TileMapView = require "views/TileMap"

module.exports = View.extend "Viewport",
  {
    create: (viewportModel) ->
      view = @_super()

      view.model = viewportModel

      view.el = new createjs.Container

      view.tileMapView = TileMapView.create viewportModel

      view.el.addChild view.tileMapView.el

      view
  }, {
    dispose: ->
      @tileMapView.dispose()

      @_super()
  }
