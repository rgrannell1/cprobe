
"use strict"





const colors    = require('colors')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')






const displayStats = { }





{

	let previousLines = 0

	displayStats.success = urlSummaries => {

		const healthColours = [
			{level: 'success', colour: 'green'},
			{level: 'warning', colour: 'yellow'},
			{level: 'failure', colour: 'red'}
		]

		const displayLines = Array.prototype.concat.apply( [ ], urlSummaries.map(urlSummary => {

			const timeIntervalDate = urlSummary.summaries
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

			const counts = urlSummary.summaries
				.map(data => data.stats.count)
				.reduce((acc, count) => acc + count, 0)

			return [
				urlSummary.url.url,
				`	attempts ${counts}`,
				`	${timeIntervalDate}`
			]

		}) )

		utils.terminal.eraseLines(previousLines)

		console.log(displayLines.join('\n'))

		previousLines = displayLines.length

	}

}





module.exports = displayStats
