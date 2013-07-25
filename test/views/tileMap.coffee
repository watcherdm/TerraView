TileMapView = require "views/TileMap"
HeightmapModel = require "models/Heightmap"
ViewportModel = require "models/Viewport"
TileModel = require "models/Tile"
TileView = require "views/Tile"

describe "View TileMap", ->
  beforeEach ->
    @viewportModel = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9
    @view = TileMapView.create @viewportModel

  afterEach ->
    @viewportModel.dispose()
    @view.dispose()

    expect(TileMapView.getUsedLength()).to.equal 0
    expect(HeightmapModel.getUsedLength()).to.equal 0
    expect(ViewportModel.getUsedLength()).to.equal 0
    expect(TileModel.getUsedLength()).to.equal 0
    expect(TileView.getUsedLength()).to.equal 0

  it "should have an el", ->
    expect(@view.el).to.not.equal undefined

  it "should have a heightmap", ->
    expect(@view.heightmap).to.not.equal undefined

  it "should have a viewport model", ->
    expect(@view.heightmap).to.not.equal undefined

  it "should populate tile model collection", ->
    expect(@view.tileModels.length).to.equal 12

  it "should add tile views to container", ->
    expect(@view.el.children.length).to.equal 12
