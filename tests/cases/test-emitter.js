
"use strict"





const is        = require('is')
const colors    = require('colors')
const constants = require('../../src/commons/constants')
const expect    = require('expect.js')
const utils     = require('../commons/utils')
const schemas   = require('../schemas/schemas')





const report = {
	success: message => {
		console.error(`✓ ${message}`.green)
	},
	failure: (err, message)  => {

		console.error(`✕ ${message}`.red)
		console.error(err)
		process.exit(1)

	}
}





const testConstants = {
	duration:  120 * 1000,
	startTime: Date.now( )
}





const tests = {
	schema: { }
}

tests.schema = utils.label('# schema:', summaries => {
	utils.assertSchema(schemas.http( ), summaries)
})

tests.intervalsOverTime = utils.label('# recorded time vs actual time: ', (start, intervals, summaries) => {

	summaries.forEach(summary => {

		const actualLength    = summary.summaries.length
		const elaspedTime     = Date.now( ) - start
		const currentInterval = intervals.find(interval => elaspedTime < interval)
		const expectedLength = intervals.indexOf(currentInterval) + 1

		if (elaspedTime  > currentInterval + 2 * constants.units.millisecondsPerSecond) {

			expect(actualLength).to.be.equal(expectedLength)

		}

	})

})

tests.responseTime = utils.label('# response-time:', (expected, leeway, summaries) => {

	summaries.forEach(summary => {
		summary.summaries.forEach(urlSummary => {
			expect(urlSummary.stats.responseTimeMs.median).to.be.within(expected - (leeway * expected), expected + (leeway * expected))
		})
	})

})

{
	let rates = [ ]

	utils.label('# success rate:', tests.rollingSuccessRate = (expected, leeway, summaries) => {

		summaries.forEach(summary => {
			summary.summaries.forEach(urlSummary => {

				rates.push(urlSummary.stats.successPercentage)

				const meanRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length

				expect(meanRate).to.be.within(expected - (leeway * expected), expected + (leeway * expected))

			})
		})

	})
}

tests.stdout = summaries => { }






const cases = { }

cases.certainSuccess = port => {

	const message = "tests (certain success)"

	utils.setup.http({
		port,
		timeout: testConstants.duration,
		routes: [
			{
				method:     'get',
				route:      '*',
				middleware: (req, res) => res.status(200).send('')
			}
		],
		tests: [( ) => { }]
	})
	.then(
		( ) => report.success(message))
	.catch(
		err => report.failure(err, message))

}

cases.certainFailure = port => {

	const message     = "tests (certain failure)"
	const failMessage = "deliberate failure"

	utils.setup.http({
		port,
		timeout: testConstants.duration,
		routes: [
			{
				method:     'get',
				route:      '*',
				middleware: (req, res) => res.status(200).send('')
			}
		],
		tests: [
			( ) => { throw Error(failMessage) }
		]
	})
	.then(( ) => {

		console.error(`✕ ${message}`.red)
		process.exit(1)

	})
	.catch(err => {

		if (err.message.indexOf(failMessage) !== -1) {
			report.success(message)
		} else {
			console.error(`✕ ${message}`.red)
			process.exit(1)
		}

	})

}

cases.healthyServer = port => {

	const message = "cprobe (healthy http-server)"

	utils.setup.http({
		port,
		timeout: testConstants.duration,
		routes: [
			{
				method:     'get',
				route:      '*',
				middleware: (req, res) => {
					res.status(200).send('')
				}
			}
		],
		tests: [
			tests.schema,
			tests.intervalsOverTime.bind({ }, Date.now( ), constants.intervals),
			tests.stdout
		]
	})
	.then(( ) =>
		report.success(message))
	.catch(err =>
		report.failure(err, message))

}

cases.noResponseServer = port => {

	const message  = "cprobe (non-responsive http-server)"
	var modCounter = 0

	utils.setup.http({
		port,
		timeout: testConstants.duration,
		routes: [
			{
				method:     'all',
				route:      '*',
				middleware: ( ) => { }
			}
		],
		tests: [
			tests.schema,
			tests.intervalsOverTime.bind({ }, Date.now( ), constants.intervals),
			tests.rollingSuccessRate.bind({ }, 0, 0),
			tests.stdout
		]
	})
	.then(( ) =>
		report.success(message))
	.catch(err =>
		report.failure(err, message))

}

cases.slowHealthyServer = port => {

	const delay   = 5 * 1000
	const message = "cprobe (slow-healthy http-server)"

	utils.setup.http({
		port,
		timeout: testConstants.duration,
		routes: [
			{
				method:     'get',
				route:      '*',
				middleware: (req, res) => {

					setTimeout(( ) => {
						res.status(200).send('')
					}, delay)

				}
			}
		],
		tests: [
			tests.schema,
			tests.intervalsOverTime.bind({ }, Date.now( ), constants.intervals),
			tests.responseTime.bind({ }, delay, 0.2 * delay)
		]
	})
	.then(( ) =>
		report.success(message))
	.catch(err =>
		report.failure(err, message))

}





cases.certainSuccess(6000)
cases.certainFailure(6010)
cases.healthyServer(6020)
cases.slowHealthyServer(6040)
cases.noResponseServer(6030)
