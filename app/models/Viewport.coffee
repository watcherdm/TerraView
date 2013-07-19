Model = require "models/base/Model"

module.exports = Model.extend "Viewport",
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
  }
