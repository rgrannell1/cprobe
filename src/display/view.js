
"use strict"






const colours   = require('colors')
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

		displayLines.push(view.carraigeReturn.responseTime(urlSummary))
		displayLines.push(view.carraigeReturn.attempts(urlSummary))
		displayLines.push(view.carraigeReturn.successRate(urlSummary))

	})

	utils.terminal.eraseLines(previousLines)
	previousLines = displayLines.length

	console.log(displayLines.join('\n'))

}

view.carraigeReturn.responseTime = urlSummary => {

	const entries = urlSummary.fields.responseTime.map( ({intervalMs, value, level}) => {
		return `${value}ms`
	})

	return displayKey('response time', 4, entries.join(' | '))

}

view.carraigeReturn.attempts = urlSummary => {
	return displayKey('attempts', 4, urlSummary.fields.attempts)
}
view.carraigeReturn.successRate = urlSummary => {

	const healthColours = [
		{level: 'success', colour: 'green'},
		{level: 'warning', colour: 'yellow'},
		{level: 'failure', colour: 'red'}
	]
	const entries = urlSummary.fields.successRate.map( ({intervalMs, successPercent, level}) => {

		const colour = healthColours.find(({level, colour}) => {
			return successPercent >= constants.thresholds.successPercentage[level]
		}).colour

		const displayInterval       = utils.displayTime(intervalMs / constants.units.millisecondsPerSecond)
		const displaySuccessPercent = (successPercent + '')[colour]

		return `${displayInterval} ${displaySuccessPercent}`

	} )

	return '    ' + entries.join(' | ')

}





view.json = ({content}) => {
	console.log(content)
}





module.exports = view
