utils = require "lib/utils"

describe "Lib Utils", ->
  it "should clamp", ->
    expect(utils.clamp 10, 20).to.equal 10
    expect(utils.clamp 21, 20).to.equal 1
    expect(utils.clamp -10, 20).to.equal 10

  it "should random", ->
    expect(utils.random 20).to.equal 0.9575093308120967

  it "should tileHeightToType", ->
    expect(utils.tileHeightToType 4, 10).to.equal 0
    expect(utils.tileHeightToType 6, 10).to.equal 1
