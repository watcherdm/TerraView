module.exports = gamecore.DualPooled.extend "Model",
  {
    getUsedLength: ->
      @getPool().usedList.length()
  }, {
    dispose: ->
      @release()
  }
