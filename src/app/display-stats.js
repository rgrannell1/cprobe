
"use strict"





const utils     = require('../commons/utils')






const displayStats = { }





var previousLines = 0

displayStats.success = summaries => {

	const lines = [ ]

	summaries.forEach(summary => {

		const displayData = summary.summaries.map(intervalSummary => {

			const percentage = Math.floor(intervalSummary.stats.successPercentage * 100)

			return `${intervalSummary.interval}s ${percentage}%`

		}).join(' | ')

		lines.push(summary.url.url)
		lines.push(`	${displayData}`)

	})

	utils.terminal.eraseLines(previousLines)

	console.log(lines.join('\n'))
	previousLines = lines.length

}





module.exports = displayStats
