
"use strict"




const constants          = require('../commons/constants')
const extractResponseStats      = require('../app/response-stats')
const parseUrl           = require('../app/parse-url')
const summariseResponses = require('../app/summarise-responses')
const testUrlStatuses    = require('../app/test-url-statuses')
const utils              = require('../commons/utils')
const displayStats       = require('../app/display-stats')




const cprobe = args => {

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

			responseStats.push(extractResponseStats(event, response))

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





module.exports = cprobe
