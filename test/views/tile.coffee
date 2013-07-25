TileView = require "views/Tile"

describe "View Tile", ->
  beforeEach ->
    @view = TileView.create()

  afterEach ->
    @view.dispose()

    expect(TileView.getUsedLength()).to.equal 0

  it "should exist", ->
    expect(@view).to.not.equal undefined
