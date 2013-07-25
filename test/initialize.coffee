tests = [
  "./utils"
  "./models/heightmapChunk"
  "./models/heightmap"
  "./models/tile"
  "./models/viewport"
  "./views/viewport"
  "./views/stage"
  "./views/tile"
  "./views/tileMap"
]

for test in tests
  require test
