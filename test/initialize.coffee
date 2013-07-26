tests = [
  "./utils"
  "./models/heightmapChunk"
  "./models/heightmap"
  "./models/tile"
  "./models/viewport"
  "./views/tile"
  "./views/tileMap"
  "./views/viewport"
  "./views/stage"
]

for test in tests
  require test
