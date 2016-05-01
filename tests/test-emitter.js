
"use strict"





const expect = require('expect.js')
const utils  = require('./utils')




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

	const summary = summaries[0]

	expect(summary.summaries).to.be.an('array')

	expect(summary.url).to.be.an('object')

	expect(summary.url.id).to.be.a('number')
	expect(summary.url.protocol).to.be.a('string')
	expect(summary.url.url).to.be.a('string')

	summary.summaries.forEach(summary => {

		expect(summary.interval).to.be.a('string')
		expect(summary.stats).to.be.a('object')

		expect(summary.stats.count).to.be.a('number')
		expect(summary.stats.responseTime).to.be.a('number')
		expect(summary.stats.successPercentage).to.be.a('number')

	})

}





utils.cprobeTestApp.http(
	6000,
	(req, res) => res.status(200).send(''),
	summaries => {

		tests.schema(summaries)

	}
)
