ViewportView = require "views/Viewport"
ViewportModel = require "models/Viewport"

describe "View Viewport", ->
  beforeEach ->
    @viewportModel = ViewportModel.create 1, 2, 3, 4, 5, 6, 7, 8, 9
    @view = ViewportView.create @viewportModel

  afterEach ->
    @view.dispose()
    @viewportModel.dispose()

    expect(ViewportView.getUsedLength()).to.equal 0
    expect(ViewportModel.getUsedLength()).to.equal 0

  it "should have a model", ->
    expect(@view.model).to.not.equal undefined
