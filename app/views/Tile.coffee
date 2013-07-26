View = require "views/base/View"

module.exports = View.extend "TileView",
  {
    create: (tileModel) ->
      view = @_super()

      view.model = tileModel

      view.el = new createjs.Bitmap "/images/tileset_terra.png"

      view.model.setIndexCallback ->
        view.setSpritePosition()

      view.setSpritePosition()

      view
  }, {
    setSpritePosition: ->
      index = @model.index
      x = (index % 16)
      y = ~~(index / 16)

      @el.sourceRect = new createjs.Rectangle x * 16, y * 16, 16, 16
  }
