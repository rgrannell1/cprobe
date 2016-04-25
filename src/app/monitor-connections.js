
"use strict"





const constants = require('../commons/constants')
const utils     = require('../commons/utils')





const bucketResponses = (intervals, responses) => {

	const windows = { }

	intervals.forEach(interval => {

		windows[interval] = { }

		Object.keys(responses.urls).forEach(url => {
			windows[interval][url] = responses.urls[url].filter(response => {
				return Date.now( ) - response.time
			})
		})

	})

	return windows

}

const summariseResponses = responses => {

	const windows   = bucketResponses([30, 60, 300, 600, 1800], responses)
	const summaries = { }

	Object.keys(windows).forEach(interval => {

		const summary = { }
		const window  = windows[interval]

		Object.keys(windows).forEach(interval => {

			summary[interval] = { }

			Object.keys(windows[interval]).forEach(id => {

				const timeWindow   = windows[interval][id]
				const successCount = timeWindow.filter(response => {
					return response.event === constants.events.connSuccess
				}).length

				summary[interval][id] = {
					sucessPercentage: successCount / timeWindow.length,
					statuses:         utils.tabulate(timeWindow.map(response => response.info.status))
				}

			})

		})

		summaries[interval] = summary

	})

	return summaries

}

const getResponseStats = responses => {

	const windows = summariseResponses(responses)

	console.log( JSON.stringify(windows, null, 4) )

}

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

	const responses  = {urls: { }}
	const eventTypes = [
		constants.events.connSuccess,
		constants.events.connFailure
	]

	// store any response data for succeeded / failed responses.

	eventTypes.forEach(event => {

		connStatuses.on(event, response => {

			const id                = response.url.id
			const processedResponse = processResponse(event, response)

			responses.urls[id] = (responses.urls[id] || [ ]).concat(processedResponse)
			getResponseStats(responses)

		})

	})

}





module.exports = monitorConnections
