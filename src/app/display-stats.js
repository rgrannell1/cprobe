
"use strict"





const colors    = require('colors')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')






const displayStats = { }





{

	let previousLines = 0

	displayStats.success = urlSummaries => {

		const thresholdColours = [
			{level: 'success', colour: 'green'},
			{level: 'warning', colour: 'yellow'},
			{level: 'failure', colour: 'red'}
		]

		const displayLines = Array.prototype.concat.apply( [ ], urlSummaries.map(urlSummary => {

			const displayData = urlSummary.summaries
				.map(timeData => {

					const date           = utils.displayTime(timeData.interval)
					const successPercent = timeData.stats.successPercentage

					var successRate

					for (let {level, colour} of thresholdColours) {

						let colourThreshhold = constants.threshholds.successPercentage[level]

						if (successPercent >= colourThreshhold) {
							successRate = utils.percentify(successPercent)[colour]
							break
						}

					}

					return `${date} ${successRate}`

				})
				.join(' | ')

			return [
				urlSummary.url.url,
				`	${displayData}`
			]

		}) )

		utils.terminal.eraseLines(previousLines)

		console.log(displayLines.join('\n'))

		previousLines = displayLines.length

	}

}





module.exports = displayStats
