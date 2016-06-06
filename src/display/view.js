
"use strict"






const colours   = require('colors')
const is        = require('is')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')






const view = { }





var previousLines = 0

view.carraigeReturn = urlSummaryModels => {

	const displayLines = [ ]

	urlSummaryModels.forEach(urlSummary => {

		displayLines.push(urlSummary.header)

		displayLines.push(view.carraigeReturn.attempts(urlSummary))

		displayLines.push(view.carraigeReturn.intervals(urlSummary))
		displayLines.push(view.carraigeReturn.responseTime(urlSummary))
		displayLines.push(view.carraigeReturn.successRate(urlSummary))

	})

	utils.terminal.eraseLines(previousLines)
	previousLines = displayLines.length

	console.log(displayLines.join('\n'))

}

view.carraigeReturn.intervals = urlSummary => {

	// get the longest row label length.
	const labelWidth = Object.keys(urlSummary.table).reduce((longestLength, currentKey) => {

		const currentLabelLength = urlSummary.table[currentKey].reduce((longestLength, current) => {

			return current.label && (current.label.length > longestLength)
				? current.label.length
				: longestLength

		}, -Infinity)

		return currentLabelLength > longestLength
			? currentLabelLength
			: longestLength

	}, -Infinity)

	const displayIntervals = urlSummary.table.intervals
		.map(intervalMs => {
			return utils.displayTime(intervalMs / constants.units.millisecondsPerSecond).toString( ).bold
		})
		.join(' | ')

	var padding = ''

	for (let ith = 0; ith < labelWidth; ++ith) {
		padding += ' '
	}

	return `${padding}${displayIntervals}`

}

view.carraigeReturn.responseTime = urlSummary => {

	const entries = urlSummary.table.responseTimes.map( ({intervalMs, value, level}) => {
		return value ? `${value}ms` : 'unknown'
	})

	return `response time: ${ entries.join(' | ') }`

}

view.carraigeReturn.attempts = urlSummary => {
	return `attempts: ${urlSummary.fields.attempts}`
}

view.carraigeReturn.successRate = urlSummary => {

	const healthColours = [
		{level: 'success', colour: 'green'},
		{level: 'warning', colour: 'yellow'},
		{level: 'failure', colour: 'red'}
	]
	const entries = urlSummary.table.successRates.map( ({intervalMs, successPercent, level}) => {

		const colour = healthColours.find(({level, colour}) => {
			return successPercent >= constants.thresholds.successPercentage[level]
		}).colour

		const displaySuccessPercent = utils.percentify(successPercent)[colour]

		return `${displaySuccessPercent}`

	} )

	return urlSummary.table.successRates[0].label + ' ' + entries.join(' | ')

}





view.json = ({content}) => {
	console.log(content)
}





module.exports = view
