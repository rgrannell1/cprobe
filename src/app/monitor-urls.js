
"use strict"





const constants          = require('../commons/constants')
const displayStats       = require('../app/display-stats')
const extractMetrics     = require('../app/extract-metrics')
const summariseResponses = require('../app/summarise-responses')
const utils              = require('../commons/utils')





const monitorUrls = connStatuses => {

	const responses  = [ ]
	const eventTypes = [
		constants.events.connSuccess,
		constants.events.connFailure
	]

	// store any response data for succeeded / failed responses.

	eventTypes.forEach(event => {

		connStatuses.on(event, response => {

			responses.push(extractMetrics(event, response))

			displayStats.success(summariseResponses(responses))

		})

	})

}





module.exports = monitorUrls
