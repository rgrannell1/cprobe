
"use strict"




var constants = {
	defaults: {
		protocol: 'http'
	},
	escapeSequences: {
		lineUp:     '\x1b[A',
		lineDelete: '\x1b[K'
	},
	events: {
		connSuccess: 'connSuccess',
		connFailure: 'connFailure',
		summaries:   'summaries'
	},
	intervals: [
		30   * 1000,
		60   * 1000,
		300  * 1000,
		600  * 1000,
		1800 * 1000
	],
	packageJson: require('../../package'),
	regex: {
		protocol: /^([a-z]+):[\/]{2}/
	},
	threshholds: {
		successPercentage: {
			failure: 0,
			warning: 0.95,
			success: 1
		}
	},
	units: {
		millisecondsPerSecond:     1000,
		nanosecondsPerMillisecond: 10000000,
		secondsPerMinute:          60
	}
}





module.exports = constants
