
"use strict"





const displayStats       = require('../app/display-stats')
const summariseResponses = require('../app/summarise-responses')
const constants          = require('../commons/constants')
const utils              = require('../commons/utils')





const processResponse = (event, response) => {
	return processResponse[response.url.protocol](event, response)
}

processResponse.http = (event, response) => {

	return {
		event,
		url:  response.url,
		time: response.time,
		info: {
			status:     response.res
				? response.res.statusCode
				: null,
			bodyLength: response.body
				? response.body.length
				: null
		}
	}

}

processResponse.https = processResponse.http





const monitorConnections = connStatuses => {

	const responses  = [ ]
	const eventTypes = [
		constants.events.connSuccess,
		constants.events.connFailure
	]

	// store any response data for succeeded / failed responses.

	eventTypes.forEach(event => {

		connStatuses.on(event, response => {

			responses.push(processResponse(event, response))

			displayStats.success(summariseResponses(responses))

		})

	})

}





module.exports = monitorConnections
