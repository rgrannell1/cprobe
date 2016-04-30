
"use strict"





const colors    = require('colors')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')






const displayStats = { }






{

	let previousLines = 0

	displayStats.success = urlSummaries => {

		const displayLines = Array.prototype.concat.apply( [ ], urlSummaries.map(urlSummary => {

			return [
				urlSummary.url.url,
				'	response time ' + displayStats.success.responseTime(urlSummary),
				'	attempts ' + displayStats.success.totalUrlCount(urlSummary),
				'	' + displayStats.success.successByTime(urlSummary)
			]

		}) )

		utils.terminal.eraseLines(previousLines)

		console.log(displayLines.join('\n'))

		previousLines = displayLines.length

	}

}

displayStats.success.responseTime = urlSummary => {

	return urlSummary.summaries
		.map(data => data.stats.responseTime
			? data.stats.responseTime + 'ms'
			: 'unknown')
		.join(' | ')

}

displayStats.success.totalUrlCount = urlSummary => {

	return urlSummary.summaries
		.map(data => data.stats.count)
		.reduce((acc, count) => acc + count, 0)

}

displayStats.success.successByTime = urlSummary => {

	const healthColours = [
		{level: 'success', colour: 'green'},
		{level: 'warning', colour: 'yellow'},
		{level: 'failure', colour: 'red'}
	]

	return urlSummary.summaries
		.map(timeData => {

			const successPercent = timeData.stats.successPercentage
			const healthColour   = healthColours.find( ({level, colour}) => {
				return successPercent >= constants.threshholds.successPercentage[level]
			} ).colour

			const date        = utils.displayTime(timeData.interval)
			const successRate = utils.percentify(successPercent)[healthColour]

			return `${date} ${successRate}`

		})
		.join(' | ')

}





module.exports = displayStats
