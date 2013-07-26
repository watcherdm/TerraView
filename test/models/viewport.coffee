ViewportModel = require "models/Viewport"

describe "Model Viewport", ->
  beforeEach ->
    @viewportModel = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9

  afterEach ->
    @viewportModel.dispose()

    expect(ViewportModel.getUsedLength()).to.equal 0

  it "should have valid properties", ->
    expect(@viewportModel.x).to.equal 1
    expect(@viewportModel.y).to.equal 2
    expect(@viewportModel.width).to.equal 3
    expect(@viewportModel.height).to.equal 4
    expect(@viewportModel.worldChunkWidth).to.equal 5
    expect(@viewportModel.worldChunkHeight).to.equal 6
    expect(@viewportModel.chunkWidth).to.equal 7
    expect(@viewportModel.chunkHeight).to.equal 8
    expect(@viewportModel.maxElevation).to.equal 9

  it "should compute world tile size", ->
    expect(@viewportModel.worldTileWidth).to.equal 35
    expect(@viewportModel.worldTileHeight).to.equal 48

  it "should set x/y", ->
    expect(@viewportModel.x).to.equal 1
    expect(@viewportModel.y).to.equal 2

    @viewportModel.setX 3
    @viewportModel.setY 5

    expect(@viewportModel.x).to.equal 3
    expect(@viewportModel.y).to.equal 5

  it "should fire an event when x/y change", ->
    eventCalled = false

    eventCallback = ->
      eventCalled = true

    EventBus.addEventListener "!viewport:move", eventCallback, @

    @viewportModel.setX 4

    expect(eventCalled).to.equal true

    EventBus.removeEventListener eventCallback, @
