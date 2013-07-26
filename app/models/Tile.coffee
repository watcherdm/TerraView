Model = require "models/base/Model"

module.exports = Model.extend "TileModel",
  {
    create: (index, x, y) ->
      model = @_super()

      model.index = index
      model.x = x
      model.y = y

      model
  }, {
    setIndex: (index) ->
      if @index isnt index
        @index = index

        @onChangeIndex()

    setIndexCallback: (callback) ->
      @onChangeIndex = callback

    onChangeIndex: ->
  }
