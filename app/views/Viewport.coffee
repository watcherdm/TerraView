View = require "views/base/View"

module.exports = View.extend "Viewport",
  {
    create: (viewportModel) ->
      view = @_super()

      view.model = viewportModel

      view
  }, {
  }
