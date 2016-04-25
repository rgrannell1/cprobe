
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

		summaries[interval] = { }

		Object.keys(windows[interval]).forEach(id => {

			const timeWindow   = windows[interval][id]
			const successCount = timeWindow.filter(response => {
				return response.event === constants.events.connSuccess
			}).length

			summaries[interval][id] = {
				successPercentage: successCount / timeWindow.length,
				statuses:         utils.tabulate(timeWindow.map(response => response.info.status))
			}

		})

	})

	return summaries

}

const extractUrls = responses => {

	const urls    = { }
	const matched = new Set( )

	Object.keys(responses.urls).forEach(id => {

		responses.urls[id].forEach(response => {

			const url = response.url

			if (!matched.has(url.id)) {
				urls[url.id] = url
			}

		})

	})

	return urls

}

const displayStats = (responses, stats) => {

	const urls = extractUrls(responses)

	Object.keys(stats).forEach(interval => {
		Object.keys(stats[interval]).forEach(id => {

			const url      = urls[id]
			const urlStats = stats[interval][id]

			console.log(url.url)
			console.log(`${urlStats.successPercentage * 100}%`)
			console.log('')

		})
	})

}

const getResponseStats = responses => {
	displayStats(responses, summariseResponses(responses))
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
