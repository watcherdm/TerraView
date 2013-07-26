TileView = require "views/Tile"
TileModel = require "models/Tile"

describe "View Tile", ->
  beforeEach ->
    @tileModel = TileModel.create 1, 2, 3
    @tileView = TileView.create @tileModel

  afterEach ->
    @tileView.dispose()
    @tileModel.dispose()

    expect(TileView.getUsedLength()).to.equal 0
    expect(TileModel.getUsedLength()).to.equal 0

  it "should have an el", ->
    expect(@tileView.el).to.not.equal undefined

  it "should set sprite sheet position", ->
    expect(@tileView.el.sourceRect.x).to.equal 16
    expect(@tileView.el.sourceRect.y).to.equal 0

  it "should set sprite position when model index changes", ->
    expect(@tileView.el.sourceRect.x).to.equal 16
    expect(@tileView.el.sourceRect.y).to.equal 0

    @tileModel.setIndex 3

    expect(@tileView.el.sourceRect.x).to.equal 48
    expect(@tileView.el.sourceRect.y).to.equal 0
