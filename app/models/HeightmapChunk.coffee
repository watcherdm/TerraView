Model = require "models/base/Model"

module.exports = Model.extend "HeightmapChunk",
  {
    create: (args...) ->
      model = @_super()

      model.cells = @bilinearInterpolate args...

      model

    bilinearInterpolate: (nw, ne, se, sw, width, height) ->
      xLookup = []
      cells = []

      for y in [0..height - 1]
        cells[y] = []
        yStep = y / (height - 1)

        for x in [0..width - 1]
          if xLookup[x]?
            xStep = xLookup[x]
          else
            xStep = xLookup[x] = x / (width - 1)

          topHeight = nw + xStep * (ne - nw)
          bottomHeight = sw + xStep * (se - sw)
          cellHeight = topHeight + yStep * (bottomHeight - topHeight)
          cells[y][x] = ~~cellHeight

      cells
  }, {
  }
