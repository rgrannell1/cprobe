
"use strict"





const is        = require('is')
const colors    = require('colors')
const fs        = require('fs');
const events    = require('events')
const readline  = require('readline')
const path      = require('path')
const constants = require('../../src/commons/constants')
const expect    = require('expect.js')
const utils     = require('../commons/utils')






const schemas = { }

schemas.http = ( ) => {

	const url = {
		id: {
			type: 'number'
		},
		protocol: {
			type: 'string'
		},
		url: {
			type: 'string'
		}
	}

	const stats = {
		successPercentage: {
			type: 'number'
		},
		count: {
			type: 'number'
		},
		responseTimeMs: {
			'median': {
				type: 'number'
			}
		},
		responseCodes: {
			type: 'array',
			children: {
				value: {
					type: 'number'
				},
				count: {
					type: 'number'
				}
			}
		}
	}

	const summaries = {
		type: 'array',
		children: {
			intervalMs: {
				type: 'number',
			},
			stats
		}
	}

	return {
		type: 'array',
		children: {
			url:       url,
			summaries: summaries
		}
	}

}

schemas.https = schemas.http





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
		timeout: 60 * 1000,
		sender:  (_, res) => {
			res.status(200).send('')
		},
		tests: [( ) => { }]
	})
	.then(( ) => {


		console.error(`✓ ${message}`.green)


	})
	.catch(err => {

		console.error(`✕ ${message}`.red)
		console.error(err)
		process.exit(1)

	})

}

cases.certainFailure = ( ) => {

	const message     = "tests (certain failure)"
	const failMessage = "deliberate failure"

	utils.setup.http({
		port:    6000,
		timeout: 60 * 1000,
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
			console.error(`✓ ${message}`.green)
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
		timeout: 60 * 1000,
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
		console.error(`✓ ${message}`.green)
	})
	.catch(err => {

		console.error(`✕ ${message}`.red)
		console.error(err)
		process.exit(1)

	})

}

cases.halfHealthyServer = ( ) => {

	const message = "cprobe (50%-healthy http-server)"

	utils.setup.http({
		port:    6020,
		timeout: 60 * 1000,
		sender:  (_, res) => {
			if (Math.random( ) > 0.5) {
				res.send('')
			}
		},
		tests: [
			tests.schema,
			tests.intervals.bind({ }, Date.now( ), constants.intervals),
			tests.successRate.bind({ }, 0.5, 0.1, 100),
			tests.stdout
		]
	})
	.then(( ) => {
		console.error(`✓ ${message}`.green)
	})
	.catch(err => {

		console.error(`✕ ${message}`.red)
		console.error(err)
		process.exit(1)

	})

}

cases.slowRespondServer = ( ) => {

	const message = "cprobe (slow-healthy http-server)"

	utils.setup.http({
		port:    6030,
		timeout: 60 * 1000,
		sender:  (_, res) => {

			setTimeout(( ) => {
				res.status(200).send('')
			}, 1000)

		},
		tests: [
			tests.schema,
			tests.intervals.bind({ }, Date.now( ), constants.intervals),
			tests.responseTime.bind({ }, 1000, 0.1)
		]
	})
	.then(( ) => {
		console.error(`✓ ${message}`.green)
	})
	.catch(err => {

		console.error(`✕ ${message}`.red)
		console.error(err)
		process.exit(1)

	})

}





cases.certainSuccess( )
cases.certainFailure( )
cases.healthyServer( )
cases.halfHealthyServer( )
cases.slowRespondServer( )
