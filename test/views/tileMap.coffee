TileMapView = require "views/TileMap"
HeightmapModel = require "models/Heightmap"
ViewportModel = require "models/Viewport"
TileModel = require "models/Tile"
TileView = require "views/Tile"
utils = require "lib/utils"

describe "View TileMap", ->
  beforeEach ->
    utils.seed = 19870910

    @viewportModel = ViewportModel.create 1, 2, 5, 6, 5, 6, 7, 8, 9
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
    expect(@view.tileModels.length).to.equal 30

  it "should add tile views to container", ->
    expect(@view.el.children.length).to.equal 30

  it "should redraw when key down event is fired by viewport", ->
    tileModels = @view.tileModels

    expect(tileModels[0].index).to.equal 185

    @viewportModel.setX 12

    expect(tileModels[0].index).to.equal 255
