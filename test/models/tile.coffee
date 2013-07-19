TileModel = require "models/Tile"

describe "Model Tile", ->
  beforeEach ->
    @model = TileModel.create 1, 2, 3

  afterEach ->
    @model.dispose()

    expect(TileModel.getPool().usedList.length()).to.equal 0

  it "should be valid", ->
    expect(@model.index).to.equal 1
    expect(@model.x).to.equal 2
    expect(@model.y).to.equal 3