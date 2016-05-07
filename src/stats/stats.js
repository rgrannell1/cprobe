
"use strict"





const constants = require('../commons/constants')
const utils     = require('../commons/utils')





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
		.map(res => res.metrics.statusCode)
		.filter(res => res !== null)

	return responseStatusCodes.length === 0
		? null
		: utils.tabulate(responseStatusCodes)

}





module.exports = stats
