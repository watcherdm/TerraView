TileView = require "views/Tile"
TileModel = require "models/Tile"

describe "View Tile", ->
  beforeEach ->
    @tileModel = TileModel.create 1, 2, 3
    @view = TileView.create @tileModel

  afterEach ->
    @view.dispose()
    @tileModel.dispose()

    expect(TileView.getUsedLength()).to.equal 0
    expect(TileModel.getUsedLength()).to.equal 0

  it "should have an el", ->
    expect(@view.el).to.not.equal undefined

  it "should set sprite sheet position", ->
    expect(@view.el.sourceRect.x).to.equal 16
    expect(@view.el.sourceRect.y).to.equal 0
