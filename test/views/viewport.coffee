ViewportView = require "views/Viewport"
ViewportModel = require "models/Viewport"
TileMapView = require "views/TileMap"

describe "View Viewport", ->
  beforeEach ->
    @viewportModel = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9
    @viewportView = ViewportView.create @viewportModel

  afterEach ->
    @viewportView.dispose()
    @viewportModel.dispose()

    expect(ViewportView.getUsedLength()).to.equal 0
    expect(ViewportModel.getUsedLength()).to.equal 0
    expect(TileMapView.getUsedLength()).to.equal 0

  it "should have a model", ->
    expect(@viewportView.model).to.not.equal undefined

  it "should have an el", ->
    expect(@viewportView.el).to.not.equal undefined

  it "should add a tilemap view as child", ->
    expect(@viewportView.el.children.length).to.equal 1

  it "should update viewport model with movement", ->
    expect(@viewportModel.x).to.equal 1
    expect(@viewportModel.y).to.equal 2

    EventBus.dispatch "!key:down", {}, { keyCode: 37 }

    expect(@viewportModel.x).to.equal 0
    expect(@viewportModel.y).to.equal 2
