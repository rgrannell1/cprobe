
'use strict'

const millisecondsPerSecond = 1000

const constants = {
  defaults: {
    protocol: 'http'
  },
  escapeSequences: {
    lineUp: '\x1b[A',
    lineDelete: '\x1b[K'
  },
  events: {
    connSuccess: 'connSuccess',
    connFailure: 'connFailure',
    summaries: 'summaries'
  },
  intervals: [
    30 * millisecondsPerSecond,
    60 * millisecondsPerSecond,
    300 * millisecondsPerSecond,
    600 * millisecondsPerSecond,
    1800 * millisecondsPerSecond
  ],
  packageJson: require('../../package'),
  regex: {
    protocol: /^([a-z]+):[\/]{2}/
  },
  thresholds: {
    successPercentage: {
      failure: 0,
      warning: 0.95,
      success: 1
    },
    timeouts: {
      http: 30 * millisecondsPerSecond,
      https: 30 * millisecondsPerSecond
    }
  },
  units: {
    millisecondsPerSecond,
    nanosecondsPerMillisecond: 10000000,
    secondsPerMinute: 60
  }
}

module.exports = constants
