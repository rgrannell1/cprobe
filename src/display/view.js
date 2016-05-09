
"use strict"





const is        = require('is')
const utils     = require('../commons/utils')
const constants = require('../commons/constants')



const view = { }



const displayKey = (keyname, indent, value) => {

	var indentSpace = ''

	for (let ith = 0; ith < indent; ++ith) {
		indentSpace += ' '
	}

	return `${indentSpace}${keyname}: ${value}`

}

const displayTable = (indent, separator, strs) => {

	var indentSpace = ''

	for (let ith = 0; ith < indent; ++ith) {
		indentSpace += ' '
	}

	return `${indentSpace}${strs.join(separator)}`

}



var previousLines = 0

view.carraigeReturn = urlSummaries => {

	const displayLines = [ ]

	urlSummaries.forEach(urlSummary => {

		displayLines.push(urlSummary.header)

		Object.keys(urlSummary.fields).forEach(field => {

			displayLines.push( displayKey(
				field, 4, view.carraigeReturn[field](urlSummary)) )

		})

		displayLines.push(displayTable(
			' | ', 4, view.carraigeReturn.summaries(urlSummary)) )

	})

	utils.terminal.eraseLines(previousLines)
	previousLines = displayLines.length

	console.log(displayLines.join('\n'))

}

view.carraigeReturn['response time'] = urlSummary => {

	return displayTable(0, '|', urlSummary.summaries
		.map(data => is.number(data.stats.responseTimeMs.median)
			? data.stats.responseTimeMs.median + 'ms'
			: 'unknown'))

}

view.carraigeReturn.attempts = urlSummary => {

	return urlSummary.summaries
		.map(data => data.stats.count)
		.reduce((acc, count) => acc + count, 0)

}

view.carraigeReturn.summaries = urlSummary => {

	const healthColours = [
		{level: 'success', colour: 'green'},
		{level: 'warning', colour: 'yellow'},
		{level: 'failure', colour: 'red'}
	]

	return urlSummary.summaries
		.map(timeData => {

			const successPercent = timeData.stats.successPercentage
			const healthColour   = healthColours.find( ({level, _}) => {
				return successPercent >= constants.threshholds.successPercentage[level]
			} ).colour

			const interval    = utils.displayTime(timeData.intervalMs / constants.units.millisecondsPerSecond)
			const successRate = utils.percentify(successPercent)[healthColour]

			return `${interval} ${successRate}`

		})

}




view.json = ({content}) => {
	console.log(content)
}





module.exports = view
