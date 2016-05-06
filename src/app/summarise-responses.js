
"use strict"





const constants = require('../commons/constants')
const utils     = require('../commons/utils')





const assignTimeInterval = (intervals, response) => {

	const currentTime    = Date.now( )
	const elapsedSeconds = Math.floor(currentTime - response.time)

	return Object.assign({
		interval: intervals.find(candidate => candidate > elapsedSeconds)
	}, response)


}




const stats = { }

stats.successPercentage = responses => {

	const isSuccess = res => res.event === constants.events.connSuccess
	return responses.filter(isSuccess).length / responses.length

}

stats.count = responses => {
	return responses.length
}

stats.responseTimeMs = responses => {

	const responseTimeStats = { }

	const responseTimesMs = responses
		.map(res => res.metrics.responseTimeMs)
		.filter(res => res !== null)






	responseTimeStats.median = responseTimesMs.length === 0
		? null
		: utils.medianOf(responseTimesMs)

	responseTimeStats.min = responseTimesMs.length === 0
		? null
		: Math.min.apply([ ], responseTimesMs)

	responseTimeStats.max = responseTimesMs.length === 0
		? null
		: Math.max.apply([ ], responseTimesMs)

	responseTimeStats.intervals = [
		utils.atInterval(0.05, responseTimesMs),
		utils.atInterval(0.25, responseTimesMs),
		utils.atInterval(0.75, responseTimesMs),
		utils.atInterval(0.95, responseTimesMs)
	]

	return responseTimeStats

}

stats.responseCodes = responses => {

	const responseStatusCodes = responses
		.map(res => res.metrics.status)
		.filter(res => res !== null)

	return responseStatusCodes.length === 0
		? null
		: utils.tabulate(responseStatusCodes)

}






const summariseResponses = responses => {

	summariseResponses.precond(responses)

	const protocol = responses[0].url.protocol
	const summary  = { }

	Object.keys(stats).forEach(statName => {
		summary[statName] = summariseResponses.stats[protocol][statName](responses)
	})

	return summary

}

summariseResponses.precond = responses => {

	responses.reduce((expectedProtocol, response) => {

		if (expectedProtocol !== response.url.protocol) {
			throw Error(`${expectedProtocol} vs ${response.url.protocol}`)
		}

		return expectedProtocol

	}, responses[0].url.protocol)

}






summariseResponses.stats = {
	http: {
		successPercentage: stats.successPercentage,
		count:             stats.count,
		responseTimeMs:    stats.responseTimeMs,
		responseCodes:     stats.responseCodes
	},
	https: {
		successPercentage: stats.successPercentage,
		count:             stats.count,
		responseTimeMs:    stats.responseTimeMs,
		responseCodes:     stats.responseCodes
	}
}






const summariseTimeInterval = (responses) => {

	// add a 30s ago, 1m ago, ... label to the responses.
	// group responses by URL id

	return responses
		.map(assignTimeInterval.bind({ }, constants.intervals))
		.groupBy(res => res.url.id)
		.unzipKeys( )
		.map( ([id, responses]) => {

			// summarise results each 30s, 1m time interval.

			const summaries = responses
				.groupBy(res => res.interval)
				.unzipKeys( )
				.map( ([interval, responses]) => ({
				 	intervalMs: parseInt(interval, 10),
				 	stats: summariseResponses(responses)
				}) )

			return {
				url: responses[0].url,
				summaries
			}

		})

}





module.exports = summariseTimeInterval
