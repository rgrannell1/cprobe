
"use strict"





const is        = require('is')
const colors    = require('colors')
const path      = require('path')
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
	duration: 60 * 1000
}





const tests = {
	schema: { }
}

tests.schema = summaries => {
	utils.assertSchema(schemas.http( ), summaries)
}

tests.intervals = (start, intervals, summaries) => {

	const elapsedMilliseconds = Date.now( ) - start
	const expectedLength = intervals.indexOf(intervals.find(interval => interval > elapsedMilliseconds)) + 1

	expect(summaries[0].summaries.length).to.be.within(expectedLength - 1, expectedLength)

}

tests.responseTime = (expected, leeway, summaries) => {

	summaries.forEach(summary => {
		summary.summaries.forEach(urlSummary => {
			expect(urlSummary.stats.responseTimeMs.median).to.be.within(expected - (leeway * expected), expected + (leeway * expected))
		})
	})

}

tests.successRate = (expected, leeway, count, summaries) => {

	summaries.forEach(summary => {
		summary.summaries.forEach(urlSummary => {

			if (urlSummary.stats.count >= count) {
				expect(urlSummary.stats.successPercentage).to.be.within(expected - (leeway * expected), expected + (leeway * expected))
			}


		})
	})

}

tests.stdout = summaries => { }






const cases = { }

cases.certainSuccess = ( ) => {

	const message = "tests (certain success)"

	utils.setup.http({
		port:    5900,
		timeout: testConstants.duration,
		sender:  (_, res) => {
			res.status(200).send('')
		},
		tests: [( ) => { }]
	})
	.then(( ) => {

		report.success(message)

	})
	.catch(err => {
		report.failure(err, message)
	})

}

cases.certainFailure = ( ) => {

	const message     = "tests (certain failure)"
	const failMessage = "deliberate failure"

	utils.setup.http({
		port:    6000,
		timeout: testConstants.duration,
		sender:  (_, res) => {
			res.status(200).send('')
		},
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

cases.healthyServer = ( ) => {

	const message = "cprobe (healthy http-server)"

	utils.setup.http({
		port:    6010,
		timeout: testConstants.duration,
		sender:  (_, res) => {
			res.status(200).send('')
		},
		tests: [
			tests.schema,
			tests.intervals.bind({ }, Date.now( ), constants.intervals),
			tests.stdout
		]
	})
	.then(( ) => {
		report.success(message)
	})
	.catch(err => {
		report.failure(err, message)
	})

}

cases.halfHealthyServer = ( ) => {

	const message  = "cprobe (50%-healthy http-server)"
	var modCounter = 0

	utils.setup.http({
		port:    6020,
		timeout: testConstants.duration,
		sender:  (_, res) => {

			if (modCounter % 2 === 0) {
				res.status(200).send('')
			}

			++modCounter

		},
		tests: [
			tests.schema,
			tests.intervals.bind({ }, Date.now( ), constants.intervals),
			tests.successRate.bind({ }, 0.5, 0.1, 100),
			tests.stdout
		]
	})
	.then(( ) => {
		report.success(message)
	})
	.catch(err => {
		report.failure(err, message)
	})

}

cases.slowHealthyServer = ( ) => {

	const delay   = 5 * 1000
	const message = "cprobe (slow-healthy http-server)"

	utils.setup.http({
		port:    6030,
		timeout: testConstants.duration,
		sender:  (_, res) => {

			setTimeout(( ) => {
				res.status(200).send('')
			}, delay)

		},
		tests: [
			tests.schema,
			tests.intervals.bind({ }, Date.now( ), constants.intervals),
			tests.responseTime.bind({ }, delay, 0.2 * delay)
		]
	})
	.then(( ) => {
		report.success(message)
	})
	.catch(err => {
		report.failure(err, message)
	})

}





cases.certainSuccess( )
cases.certainFailure( )
cases.healthyServer( )
cases.halfHealthyServer( )
cases.slowHealthyServer( )
