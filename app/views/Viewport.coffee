View = require "views/base/View"
TileMapView = require "views/TileMap"
utils = require "lib/utils"

module.exports = View.extend "ViewportView",
  {
    create: (viewportModel) ->
      view = @_super()

      view.model = viewportModel

      view.el = new createjs.Container

      view.tileMapView = TileMapView.create viewportModel

      view.el.addChild view.tileMapView.el

      EventBus.addEventListener "!key:down", view.onKeyDown, view

      view
  }, {
    onKeyDown: (_event, args) ->
      switch args.keyCode
        when 37
          x = @model.x - 1
          x = utils.clamp x, @model.worldTileWidth
          @model.setX x
        when 38
          y = @model.y - 1
          y = utils.clamp y, @model.worldTileHeight
          @model.setY y
        when 39
          x = @model.x + 1
          x = utils.clamp x, @model.worldTileWidth
          @model.setX x
        when 40
          y = @model.y + 1
          y = utils.clamp y, @model.worldTileHeight
          @model.setY y

    dispose: ->
      EventBus.removeEventListener "!key:down", @onKeyDown, @

      @tileMapView.dispose()

      @_super()
  }
