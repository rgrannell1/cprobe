
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
	packageJson: require('../../package'),
	regex: {
		protocol: /^([a-z]+):[\/]{2}/
	},
	intervals: [30, 60, 300, 600, 1800],
	units: {
		millisecondsPerSecond: 1000
	}
}





module.exports = constants
