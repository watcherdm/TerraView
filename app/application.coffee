StageView = require "views/Stage"

module.exports = class Application
  initialize: ->
    canvasEl = document.getElementById "main-canvas"

    StageView.create canvasEl

    document.onkeydown = @onKeyDown

  onKeyDown: (event) ->
    EventBus.dispatch "!key:down", @, event
