
"use strict"




var constants = {
	escapeSequences: {
		lineUp:     '\x1b[A',
		lineDelete: '\x1b[K'
	},
	events: {
		connSuccess: 'connSuccess',
		connFailure: 'connFailure'
	},
	intervals: [30, 60, 300, 600, 1800],
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
