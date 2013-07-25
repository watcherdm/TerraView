View = require "views/base/View"

module.exports = View.extend "Tile",
  {
    create: (tileModel) ->
      view = @_super()

      view.model = tileModel

      view.el = new createjs.Bitmap "/images/tileset_terra.png"

      @setSpritePosition view

      view

    setSpritePosition: (view) ->
      model = view.model

      index = model.index
      x = index % 16
      y = ~~(index / 16)

      view.el.sourceRect = new createjs.Rectangle x * 16, y * 16, 16, 16
  }, {
  }
