StageView = require "views/Stage"
ViewportView = require "views/Viewport"
ViewportModel = require "models/Viewport"
TileView = require "views/Tile"

describe "View Stage", ->
  beforeEach ->
    @view = StageView.create ""

  afterEach ->
    @view.dispose()

    expect(StageView.getUsedLength()).to.equal 0
    expect(ViewportView.getUsedLength()).to.equal 0
    expect(ViewportModel.getUsedLength()).to.equal 0
    expect(TileView.getUsedLength()).to.equal 0

  it "should use require animation frame", ->
    expect(createjs.Ticker.useRAF).to.equal true

  it "should have a viewport view", ->
    expect(@view.el.children.length).to.equal 1
