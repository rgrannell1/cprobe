
"use strict"




const constants = require('../src/commons/constants')
const cprobe    = require('../src/app/cprobe')
const express   = require('express')





const testServers = { }

testServers.http = port => {

	return new Promise((resolve, reject) => {

		express( )
		.get('*', (req, res) => {
			res.sendStatus(200)
		})
		.listen(port, ( ) => resolve(port))

	})

}

const testApp = { }

testApp.http = (port, onSummary) => {

	testServers.http(port)
	.then(
		port => {

			const emitter = cprobe({
				'--json': true,
				'<url>': [
					`http://localhost:${port}`
				],
				'--interval': 1,
				'--version':  false
			})

			emitter.on(constants.events.summaries, onSummary)

		}
	)

}

testApp.ssh = (port, onSummary) => {

}




module.exports = {
	testApp
}
