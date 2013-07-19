Model = require "models/base/Model"
utils = require "lib/utils"
HeightmapChunkModel = require "models/HeightmapChunk"

module.exports = Model.extend "Heightmap",
  {
    create: (seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation) ->
      model = @_super()

      model.worldTileWidth = worldChunkWidth * chunkWidth
      model.worldTileHeight = worldChunkHeight * chunkHeight

      model.chunks = @buildChunks seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation, model.worldTileWidth, model.worldTileHeight

      model.heightmap = @generateHeightmap model.chunks, maxElevation

      model.data = @processTiles model.heightmap, model.worldTileWidth, model.worldTileHeight

      model

    processTiles: (heightmap, xl, yl) ->
      data = []

      cx = (x) -> utils.clamp x, xl
      cy = (y) -> utils.clamp y, yl

      for y in [0..yl - 1]
        data[y] = []

        for x in [0..xl - 1]
          n = heightmap[cy y - 1][x]
          e = heightmap[y][cx x + 1]
          s = heightmap[cy y + 1][x]
          w = heightmap[y][cx x + 1]
          ne = heightmap[cy y - 1][cx x + 1]
          se = heightmap[cy y + 1][cx x + 1]
          sw = heightmap[cy y + 1][cx x - 1]
          nw = heightmap[cy y - 1][cx x - 1]

          o = heightmap[y][x]

          if o in 0
            s = 0
          else
            a = n << n * 4
            b = e << e * 5
            c = s << s * 6
            d = w << w * 7
            e = ne << ne * 0
            f = se << se * 1
            g = nw << nw * 2
            h = sw << sw * 3

            s = a + b + c + d + e + f + g + h

          heightmapTile = s

          data[y][x] = heightmapTile

      data

    generateHeightmap: (chunks, maxElevation) ->
      heightmap = []

      for chunkRow, y in chunks
        for chunk, x in chunkRow
          cells = chunk.cells

          for cellRow, cy in cells
            for cell, cx in cellRow
              yIndex = cy + (y * cells.length)
              xIndex = cx + (x * cellRow.length)

              heightmap[yIndex] = [] unless heightmap[yIndex]?
              heightmap[yIndex][xIndex] = utils.tileHeightToType cell, maxElevation

      heightmap

    buildChunks: (seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation, worldTileWidth, worldTileHeight)->
      chunks = []

      for y in [0..worldChunkHeight - 1]
        chunks[y] = []

        for x in [0..worldChunkWidth]
          nw = utils.random(y * worldTileWidth + x + seed) * maxElevation

          if x + 1 is worldChunkWidth
            ne = utils.random(y * worldTileWidth + seed) * maxElevation
          else
            ne = utils.random(y * worldTileWidth + x + 1 + seed) * maxElevation

          if y + 1 is worldChunkWidth
            sw = utils.random(x + seed) * maxElevation

            if x + 1 is worldChunkHeight
              se = utils.random(seed) * maxElevation
            else
              se = utils.random(x + 1 + seed) * maxElevation
          else
            sw = utils.random((y + 1) * worldTileWidth + seed) * maxElevation

            if x + 1 is worldChunkWidth
              se = utils.random((y + 1) * worldTileWidth + seed) * maxElevation
            else
              se = utils.random((y + 1) * worldTileWidth + x + 1 + seed) * maxElevation

          chunks[y][x] = HeightmapChunkModel.create nw, ne, se, sw, chunkWidth, chunkHeight

      chunks
  }, {
    getArea: (sliceWidth, sliceHeight, centerX, centerY) ->
      data = []

      heightmapData = @data

      xOffset = sliceWidth >> 1
      yOffset = sliceHeight >> 1

      for y in [0..sliceHeight - 1]
        data[y] = []

        for x in [0..sliceWidth - 1]
          xIndex = utils.clamp x - xOffset + centerX, @worldTileWidth
          yIndex = utils.clamp y - yOffset + centerY, @worldTileHeight
          
          data[y][x] = heightmapData[yIndex][xIndex]

      data
  }
