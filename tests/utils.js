
"use strict"




const constants = require('../src/commons/constants')
const cprobe    = require('../src/app/cprobe')
const express   = require('express')





const mockServers = { }

mockServers.http = port => {

	return new Promise((resolve, reject) => {

		express( )
		.get('*', (req, res) => {
			res.sendStatus(200)
		})
		.listen(port, ( ) => resolve(port))

	})

}

const cprobeTestApp = { }

cprobeTestApp.http = (port, onSummary) => {

	mockServers.http(port)
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

cprobeTestApp.ssh = (port, onSummary) => {

}




module.exports = {
	cprobeTestApp
}
