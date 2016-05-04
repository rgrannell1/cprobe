
"use strict"





const is        = require('is')
const constants = require('../../src/commons/constants')
const expect    = require('expect.js')
const utils     = require('../commons/utils')





const tests = { }

tests.schema = summaries => {

	tests.schema.properties(summaries)
	tests.schema.types(summaries)

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

}





describe('#cprobe', function ( ) {

	it('has a fixed property / type schema.', function (done) {

		const start        = Date.now( )
		const caseDuration = 10 * 1000

		this.timeout(30 * 60 * 1000)

		utils.cprobeTestApp
			.http(
				6000, caseDuration,
				function (req, res) {
					res.status(200).send('')
				},
				function (summaries) {

					tests.schema(summaries)
					tests.intervals(start, constants.intervals, summaries)

				}
			)
			.then( ({emitter, server}) => {
				setTimeout(( ) => server.close(done), caseDuration)
			})
			.catch(err => {
				console.error(err.message)
			})

		})

})
