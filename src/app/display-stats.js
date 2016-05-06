
"use strict"





const is        = require('is')
const colors    = require('colors')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')






const displayStats = { }




displayStats.json = urlSummaries => {
	console.log(JSON.stringify(urlSummaries))
}





{

	let previousLines = 0

	displayStats.human = urlSummaries => {

		const displayLines = Array.prototype.concat.apply( [ ], urlSummaries.map(urlSummary => {

			return [
				urlSummary.url.url,
				'	response time ' + displayStats.human.responseTimeMs(urlSummary),
				'	attempts ' + displayStats.human.totalUrlCount(urlSummary),
				'	' + displayStats.human.successByTime(urlSummary)
			]

		}) )

		utils.terminal.eraseLines(previousLines)

		console.log(displayLines.join('\n'))

		previousLines = displayLines.length

	}

}

displayStats.human.responseTimeMs = urlSummary => {

	return urlSummary.summaries
		.map(data => is.number(data.stats.responseTimeMs.median)
			? data.stats.responseTimeMs.median + 'ms'
			: 'unknown')
		.join(' | ')

}

displayStats.human.totalUrlCount = urlSummary => {

	return urlSummary.summaries
		.map(data => data.stats.count)
		.reduce((acc, count) => acc + count, 0)

}

displayStats.human.successByTime = urlSummary => {

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

			const date        = utils.displayTime(timeData.intervalMs / constants.units.millisecondsPerSecond)
			const successRate = utils.percentify(successPercent)[healthColour]

			return `${date} ${successRate}`

		})
		.join(' | ')

}





module.exports = displayStats
