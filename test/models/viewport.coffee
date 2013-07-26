ViewportModel = require "models/Viewport"

describe "Model Viewport", ->
  beforeEach ->
    @model = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9

  afterEach ->
    @model.dispose()

    expect(ViewportModel.getUsedLength()).to.equal 0

  it "should have valid properties", ->
    expect(@model.x).to.equal 1
    expect(@model.y).to.equal 2
    expect(@model.width).to.equal 3
    expect(@model.height).to.equal 4
    expect(@model.worldChunkWidth).to.equal 5
    expect(@model.worldChunkHeight).to.equal 6
    expect(@model.chunkWidth).to.equal 7
    expect(@model.chunkHeight).to.equal 8
    expect(@model.maxElevation).to.equal 9

  it "should compute world tile size", ->
    expect(@model.worldTileWidth).to.equal 35
    expect(@model.worldTileHeight).to.equal 48

  it "should set x/y", ->
    expect(@model.x).to.equal 1
    expect(@model.y).to.equal 2

    @model.setX 3
    @model.setY 5

    expect(@model.x).to.equal 3
    expect(@model.y).to.equal 5

  it "should fire an event when x/y change", ->
    eventCalled = false

    eventCallback = ->
      eventCalled = true

    EventBus.addEventListener "!viewport:move", eventCallback, @

    @model.setX 4

    expect(eventCalled).to.equal true

    EventBus.removeEventListener eventCallback, @
