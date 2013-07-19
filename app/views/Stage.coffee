module.exports = class StageView
  constructor: (@canvasEl) ->
    @el = new createjs.Stage @canvasEl

    _.bindAll @, "onTick"

    createjs.Ticker.setFPS 60
    createjs.Ticker.useRAF = true

    createjs.Ticker.addEventListener "tick", @onTick

  onTick: ->
    @el.update()

  dispose: ->
    createjs.Ticker.removeEventListener "tick", @onTick
