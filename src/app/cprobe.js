
"use strict"




const constants          = require('../commons/constants')
const measureResponse    = require('../metrics/measure-response')
const parseUrl           = require('../network/parse-url')
const summariseResponses = require('../stats/summarise-reponses')
const testUrlStatuses    = require('../app/test-url-statuses')
const displayStats       = require('../app/display-stats')




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

		connStatuses
		.on(event, response => {

			responseStats.push(measureResponse(event, response))

			const summaries = summariseResponses(responseStats)

			connStatuses.emit(constants.events.summaries, summaries)

		})
		.on(constants.events.summaries, summaries => {

			if (args.display) {

				const displayMode = args.json
					? 'json'
					: 'human'

				displayStats[displayMode](summaries)

			}

		})

	})

	return connStatuses

}

cprobe.preprocess = rawArgs => {

	rawArgs.urls = rawArgs.urls
		.map(url => {
			return constants.regex.protocol.test(url)
				? url
				: `${constants.defaults.protocol}://${url}`
		})
		.map((url, ith) => {
			return Object.assign(parseUrl(url), {id: ith})
		})

	return rawArgs

}





module.exports = cprobe
