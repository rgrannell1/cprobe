
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






const tests = {
	schema: { }
}

tests.schema.properties = summaries => {

	expect(summaries).to.have.length(1)

	const summary = summaries[0]

	;['summaries', 'url']
		.forEach(prop => expect(summary).to.have.property(prop))

	;['id', 'protocol', 'url']
		.forEach(prop => expect(summary.url).to.have.property(prop))

	summary.summaries.forEach(timeSummary => {

		expect(timeSummary).to.have.property('interval')

		;['interval', 'stats']
			.forEach(prop => expect(timeSummary).to.have.property(prop))

		;['count', 'responseTime', 'successPercentage']
			.forEach(prop => expect(timeSummary.stats).to.have.property(prop))

	})

}

tests.schema.types = summaries => {

	expect(summaries).to.be.an('array')

	summaries.forEach(summary => {

		expect(summary.summaries).to.be.an('array')

		expect(summary.url).to.be.an('object')

		expect(summary.url.id).to.be.a('number')
		expect(summary.url.protocol).to.be.a('string')
		expect(summary.url.url).to.be.a('string')

		summary.summaries.forEach(summary => {

			expect(summary.interval).to.be.a('string')
			expect(summary.stats).to.be.a('object')

			if (!is.null(summary.stats.count)) {
				expect(summary.stats.count).to.be.a('number')
			}

			if (!is.null(summary.stats.responseTime)) {
				expect(summary.stats.responseTime).to.be.a('number')
			}

			if (!is.null(summary.stats.successPercentage)) {
				expect(summary.stats.successPercentage).to.be.a('number')
			}

		})

	})

}

tests.intervals = (start, intervals, summaries) => {

	const elapsedMilliseconds = Date.now( ) - start
	const expectedLength = intervals.indexOf(intervals.find(interval => interval > elapsedMilliseconds)) + 1

	expect(summaries[0].summaries.length).to.be.within(expectedLength - 1, expectedLength)

}

tests.responseTime = (expected, leeway, summaries) => {

	summaries.forEach(summary => {
		summary.summaries.forEach(urlSummary => {
			expect(urlSummary.stats.responseTime).to.be.within(expected - (leeway * expected), expected + (leeway * expected))
		})
	})

}

tests.stdout = summaries => {

	// proxy


}






const cases = { }

cases.certainSuccess = ( ) => {

	const message = "tests (certain success)"

	utils.setup.http({
		port:    5900,
		timeout: 6 * 1000,
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
		timeout: 6 * 1000,
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
		timeout: 6 * 1000,
		sender:  (_, res) => {
			res.status(200).send('')
		},
		tests: [
			tests.schema.properties,
			tests.schema.types,
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
		timeout: 6 * 1000,
		sender:  (_, res) => {
			res.status(Math.random( ) > 0.5 ? 200 : 404).send('')
		},
		tests: [
			tests.schema.properties,
			tests.schema.types,
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

cases.slowRespondServer = ( ) => {

	const message = "cprobe (slow-healthy http-server)"

	utils.setup.http({
		port:    6030,
		timeout: 6 * 1000,
		sender:  (_, res) => {

			setTimeout(( ) => {

				res.status(Math.random( ) > 0.5 ? 200 : 404).send('')

			}, 1000)


		},
		tests: [
			tests.schema.properties,
			tests.schema.types,
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
