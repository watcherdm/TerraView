module.exports = gamecore.DualPooled.extend "View",
  {
    getUsedLength: ->
      @getPool().usedList.length()
  }, {
    dispose: ->
      @release()
  }
