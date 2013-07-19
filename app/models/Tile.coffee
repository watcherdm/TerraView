Model = require "models/base/Model"

module.exports = Model.extend "Tile",
  {
    create: (index, x, y) ->
      model = @_super()

      model.index = index
      model.x = x
      model.y = y

      model
  }, {
  }
