TileMapView = require "views/TileMap"
HeightmapModel = require "models/Heightmap"

describe "View TileMap", ->
  beforeEach ->
    @heightmapModel = HeightmapModel 19870910, 3, 3, 4, 3, 5
    @view = TileMapView.create()

  afterEach ->
    @view.dispose()

    expect(TileMapView.getUsedLength()).to.equal 0
    expect(HeightmapModel.getUsedLength()).to.equal 0

  it "should exist", ->
    expect(@view).to.not.equal undefined
