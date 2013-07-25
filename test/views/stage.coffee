StageView = require "views/Stage"

describe "View Stage", ->
  beforeEach ->
    @view = new StageView

  afterEach ->
    @view.dispose()

  it "should use require animation frame", ->
    expect(createjs.Ticker.useRAF).to.equal true
