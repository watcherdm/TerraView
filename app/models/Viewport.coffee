Model = require "models/base/Model"

module.exports = Model.extend "ViewportModel",
  {
    create: (x, y, width, height, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation) ->
      model = @_super()

      model.x = x
      model.y = y
      model.width = width
      model.height = height
      model.worldChunkWidth = worldChunkWidth
      model.worldChunkHeight = worldChunkHeight
      model.chunkWidth = chunkWidth
      model.chunkHeight = chunkHeight
      model.maxElevation = maxElevation

      model.worldTileWidth = chunkWidth * worldChunkWidth
      model.worldTileHeight = chunkHeight * worldChunkHeight

      model
  }, {
    setX: (x) ->

      if x isnt @x
        @x = x
        EventBus.dispatch "!viewport:move", @, x

    setY: (y) ->
      if y isnt @y
        @y = y
        EventBus.dispatch "!viewport:move", @, y
  }
