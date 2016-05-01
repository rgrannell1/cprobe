
"use strict"




const constants = require('../commons/constants')
const app       = require('../app/cprobe')
const parseUrl  = require('../app/parse-url')





const callApp = rawArgs => app(callApp.preprocess(rawArgs))

callApp.preprocess = rawArgs => {

	return {
		json:     rawArgs['--json'],
		urls:     callApp.preprocess.urls(rawArgs['<url>']),
		interval: callApp.preprocess.interval(rawArgs['--interval']),
		version:  rawArgs['--version'],
		display:  rawArgs['--display']
	}

}

callApp.preprocess.urls = urls => {

	if (!urls || urls.length === 0) {
		console.error('error: no URLs supplied.')
		process.exit(1)
	}

	return urls.map((url, ith) => {
		return Object.assign(parseUrl(url), {id: ith})
	})
}

callApp.preprocess.interval = interval => {

	const value = parseInt(interval, 10) * constants.units.millisecondsPerSecond

	if (value !== value) {
		console.error('error: failed to parse --interval')
		process.exit(1)
	}

	return value

}





module.exports = callApp