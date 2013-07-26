HeightmapModel = require "models/Heightmap"

describe "Model Heightmap", ->
  beforeEach ->
    seed = 19870910
    worldChunkWidth = 3
    worldChunkHeight = 3
    chunkWidth = 4
    chunkHeight = 3
    maxElevation = 5

    @heightmapModel = HeightmapModel.create seed, worldChunkWidth, worldChunkHeight, chunkWidth, chunkHeight, maxElevation

  afterEach ->
    @heightmapModel.dispose()

    expect(HeightmapModel.getUsedLength()).to.equal 0

  it "should know world tile dimensions", ->
    expect(@heightmapModel.worldTileWidth).to.equal 12
    expect(@heightmapModel.worldTileHeight).to.equal 9

  it "should build chunks and stitch them together", ->
    expect(@heightmapModel.chunks[0][0].cells[0][0]).to.equal 0
    expect(@heightmapModel.chunks[0][0].cells[2][0]).to.equal 3
    expect(@heightmapModel.chunks[0][0].cells[2][3]).to.equal 4
    expect(@heightmapModel.chunks[0][0].cells[0][3]).to.equal 2

    expect(@heightmapModel.chunks[0][1].cells[0][0]).to.equal 2
    expect(@heightmapModel.chunks[0][1].cells[2][0]).to.equal 3
    expect(@heightmapModel.chunks[0][1].cells[2][3]).to.equal 1
    expect(@heightmapModel.chunks[0][1].cells[0][3]).to.equal 4

    expect(@heightmapModel.chunks[1][0].cells[0][0]).to.equal 3
    expect(@heightmapModel.chunks[1][0].cells[2][0]).to.equal 3
    expect(@heightmapModel.chunks[1][0].cells[2][3]).to.equal 2
    expect(@heightmapModel.chunks[1][0].cells[0][3]).to.equal 4

    expect(@heightmapModel.chunks[1][1].cells[0][0]).to.equal 4
    expect(@heightmapModel.chunks[1][1].cells[2][0]).to.equal 3
    expect(@heightmapModel.chunks[1][1].cells[2][3]).to.equal 0
    expect(@heightmapModel.chunks[1][1].cells[0][3]).to.equal 1

  it "should generate a heightmap", ->
    expect(@heightmapModel.heightmap[0][0]).to.equal 0
    expect(@heightmapModel.heightmap[5][0]).to.equal 1
    expect(@heightmapModel.heightmap[5][7]).to.equal 0
    expect(@heightmapModel.heightmap[0][7]).to.equal 1

  it "should process tiles to spritesheet indicies", ->
    expect(@heightmapModel.data[0][0]).to.equal 0
    expect(@heightmapModel.data[5][0]).to.equal 221
    expect(@heightmapModel.data[5][7]).to.equal 0
    expect(@heightmapModel.data[0][7]).to.equal 255

  it "should get an area", ->
    area = @heightmapModel.getArea 10, 10, 0, 0

    expect(area.length).to.equal 10
    expect(area[0].length).to.equal 10

    expect(area[0][0]).to.equal 0
    expect(area[9][0]).to.equal 0
    expect(area[9][9]).to.equal 249
    expect(area[0][9]).to.equal 249
