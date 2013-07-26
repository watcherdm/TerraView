module.exports = utils =
  seed: +new Date

  clamp: (index, size) ->
    (index + size) % size

  random: (seed) ->
    new RNG(seed).uniform()

  tileHeightToType: (height, maxElevation) ->
    if height / maxElevation >= 0.5
      type = 1
    else
      type = 0

    type
