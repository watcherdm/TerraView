TileModel = require "models/Tile"

describe "Model Tile", ->
  beforeEach ->
    @tileModel = TileModel.create 1, 2, 3

  afterEach ->
    @tileModel.dispose()

    expect(TileModel.getUsedLength()).to.equal 0

  it "should be valid", ->
    expect(@tileModel.index).to.equal 1
    expect(@tileModel.x).to.equal 2
    expect(@tileModel.y).to.equal 3

  it "should set index", ->
    expect(@tileModel.index).to.equal 1

    @tileModel.setIndex 5

    expect(@tileModel.index).to.equal 5

  it "should fire a callback when index has changed", ->
    eventCalled = false

    eventCallback = ->
      eventCalled = true

    @tileModel.setIndexCallback eventCallback

    @tileModel.setIndex 5

    expect(eventCalled).to.equal true
