
"use strict"





const constants = require('../commons/constants')





const model = { }




model.carraigeReturn = urlSummaries => {

	const data   = [ ]
	// TODO move to constants.
	const levels = ['success', 'warning', 'failure']

	urlSummaries.forEach(urlSummary => {

		const responseTimes = urlSummary.summaries.map(timeSummary => {

			return {
				intervalMs: timeSummary.intervalMs,
				value: timeSummary.stats.responseTimeMs.median,
			}

		})

		const successRates = urlSummary.summaries.map(timeSummary => {

			const successPercent = timeSummary.stats.successPercentage
			const level          = levels.find(level => {
				return successPercent >= constants.thresholds.successPercentage[level]
			})

			return {
				intervalMs: timeSummary.intervalMs,
				successPercent,
				level
			}

		})

		const totalAttempts = urlSummary.summaries.reduce((currentCount, timeSummary) => {
			return currentCount + timeSummary.stats.count
		}, 0)

		data.push({
			header: urlSummary.url.url,
			fields: {
				responseTime: responseTimes,
				attempts:     totalAttempts,
				successRate:  successRates
			}
		})

	})

	return data

}

model.json = urlSummaries => {

	return {
		content: JSON.stringify(urlSummaries)
	}

}





module.exports = model
