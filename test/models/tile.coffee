TileModel = require "models/Tile"

describe "Model Tile", ->
  beforeEach ->
    @model = TileModel.create 1, 2, 3

  afterEach ->
    @model.dispose()

    expect(TileModel.getUsedLength()).to.equal 0

  it "should be valid", ->
    expect(@model.index).to.equal 1
    expect(@model.x).to.equal 2
    expect(@model.y).to.equal 3

  it "should set index", ->
    expect(@model.index).to.equal 1

    @model.setIndex 5

    expect(@model.index).to.equal 5

  it "should fire a callback when index has changed", ->
    eventCalled = false

    eventCallback = ->
      eventCalled = true

    @model.setIndexCallback eventCallback

    @model.setIndex 5

    expect(eventCalled).to.equal true
