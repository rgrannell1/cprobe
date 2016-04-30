
"use strict"




const constants          = require('../commons/constants')
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

	responseStatuses.forEach(event => {

		connStatuses.on(event, response => {

			responseStats.push(extractResponseStats(event, response))

			const summaries = summariseResponses(responseStats)

			connStatuses.emit(constants.events.summaries, summaries)

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

	if (!urls || urls.length === 0) {
		console.error('error: no URLs supplied.')
		process.exit(1)
	}

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
