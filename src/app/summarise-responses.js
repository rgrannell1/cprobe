
"use strict"





const constants = require('../commons/constants')
const utils     = require('../commons/utils')





const assignTimeInterval = (intervals, response) => {

	const currentTime    = Date.now( )
	const elapsedSeconds = Math.floor((currentTime - response.time) / constants.units.millisecondsPerSecond)

	return Object.assign({
		interval: intervals.find(candidate => candidate > elapsedSeconds)
	}, response)


}

const summariseResponses = responses => {

	const summary = { }

	Object.keys(summariseResponses.stats).forEach(statName => {
		summary[statName] = summariseResponses.stats[statName](responses)
	})

	return summary

}

summariseResponses.stats = { }

summariseResponses.stats.successPercentage = responses => {

	const isSuccess = res => res.event === constants.events.connSuccess
	return responses.filter(isSuccess).length / responses.length

}

summariseResponses.stats.count = responses => {
	return responses.length
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
				 	interval,
				 	stats: summariseResponses(responses)
				}) )

			return {
				url: responses[0].url,
				summaries
			}

		})

}





module.exports = summariseTimeInterval
