ViewportView = require "views/Viewport"
ViewportModel = require "models/Viewport"
TileMapView = require "views/TileMap"

describe "View Viewport", ->
  beforeEach ->
    @viewportModel = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9
    @view = ViewportView.create @viewportModel

  afterEach ->
    @view.tileMapView.dispose()
    @view.dispose()
    @viewportModel.dispose()

    expect(ViewportView.getUsedLength()).to.equal 0
    expect(ViewportModel.getUsedLength()).to.equal 0
    expect(TileMapView.getUsedLength()).to.equal 0

  it "should have a model", ->
    expect(@view.model).to.not.equal undefined

  it "should have an el", ->
    expect(@view.el).to.not.equal undefined

  it "should add a tilemap view as child", ->
    expect(@view.el.children.length).to.equal 1
