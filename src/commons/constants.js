
"use strict"




var constants = {
	events: {
		connSuccess: 'connSuccess',
		connFailure: 'connFailure'
	},
	packageJson: require('../../package'),
	regex: {
		protocol: /^([a-z]+):[\/]{2}/
	}
}





module.exports = constants
