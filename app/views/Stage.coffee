View = require "views/base/View"
ViewportModel = require "models/Viewport"
ViewportView = require "views/Viewport"

module.exports = View.extend "StageView",
  {
    create: (canvasEl) ->
      view = @_super()

      view.el = new createjs.Stage canvasEl

      view.viewportModel = ViewportModel.create 0, 0, 30, 20, 8, 8, 8, 8, 10
      view.viewportView = ViewportView.create view.viewportModel
      view.el.addChild view.viewportView.el

      view.el.update()

      _.bindAll view, "onTick"

      createjs.Ticker.setFPS 60
      createjs.Ticker.useRAF = true

      createjs.Ticker.addEventListener "tick", view.onTick

      view
  }, {
    onTick: ->
      @el.update()

    dispose: ->
      createjs.Ticker.removeEventListener "tick", @onTick

      @viewportView.dispose()
      @viewportModel.dispose()

      @_super()
  }
