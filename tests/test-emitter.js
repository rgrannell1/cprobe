
"use strict"





const expect = require('expect.js')
const utils  = require('./utils')





utils.cprobeTestApp.http(6000, summaries => {

	expect(summaries).to.have.length(1)

	const summary = summaries[0]

	expect(summary).to.have.property('url')
	expect(summary.url).to.have.property('url')
	expect(summary.url).to.have.property('id')
	expect(summary.url).to.have.property('protocol')

	expect(summary).to.have.property('summaries')

	summary.summaries.forEach(timeSummary => {

		expect(timeSummary).to.have.property('interval')
		expect(timeSummary).to.have.property('stats')

		expect(timeSummary.stats).to.have.property('count')
		expect(timeSummary.stats).to.have.property('responseTime')
		expect(timeSummary.stats).to.have.property('successPercentage')

	})

})
