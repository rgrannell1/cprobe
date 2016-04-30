
"use strict"




const constants          = require('../commons/constants')
const displayStats       = require('../app/display-stats')
const extractResponseStats      = require('../app/response-stats')
const parseUrl           = require('../app/parse-url')
const summariseResponses = require('../app/summarise-responses')
const testUrlStatuses    = require('../app/test-url-statuses')
const utils              = require('../commons/utils')





const cprobe = rawArgs => {

	const args         = cprobe.preprocess(rawArgs)
	const connStatuses = testUrlStatuses(args, args.urls)

	if (args.version) {
		console.log(constants.packageJson.version)
		process.exit(0)
	}

	const responseStats  = [ ]
	const responseStatuses = [
		constants.events.connSuccess,
		constants.events.connFailure
	]

	// store any response data for succeeded / failed responses.

	const displayMode = args.json ? 'json' : 'human'

	responseStatuses.forEach(event => {

		connStatuses.on(event, response => {

			responseStats.push(extractResponseStats(event, response))

			//displayStats.success(summariseResponses(responseStats))
			displayStats[displayMode](summariseResponses(responseStats))

		})

	})

	return connStatuses

}

cprobe.preprocess = rawArgs => {

	return {
		json:     rawArgs['--json'],
		urls:     cprobe.preprocess.urls(rawArgs['<url>']),
		interval: cprobe.preprocess.interval(rawArgs['--interval']),
		version:  rawArgs['--version']
	}

}

cprobe.preprocess.urls = urls => {
	return urls.map((url, ith) => {
		return Object.assign(parseUrl(url), {id: ith})
	})
}

cprobe.preprocess.interval = interval => {

	const value = parseInt(interval, 10) * constants.units.millisecondsPerSecond

	if (value !== value) {
		console.error('error: failed to parse --interval')
		process.exit(1)
	}

	return value

}






module.exports = cprobe
