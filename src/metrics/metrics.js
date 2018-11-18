
'use strict'

const metrics = { }

metrics.responseTimeMs = res => {
  return res.res
    ? res.res.responseTimeMs
    : null
}

metrics.statusCode = res => {
  return res.res
    ? res.res.statusCode
    : null
}

metrics.bodyLength = res => {
  return res.body
    ? res.body.length
    : null
}

module.exports = metrics
