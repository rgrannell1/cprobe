
"use strict"




const constants = require('../src/commons/constants')
const cprobe    = require('../src/app/cprobe')
const express   = require('express')





const mockServers = { }

mockServers.http = (port, sender) => {

	return new Promise((resolve, reject) => {

		express( )
		.get('*', (req, res) => {
			sender(req, res)
		})
		.listen(port, ( ) => resolve(port))

	})

}

const cprobeTestApp = { }

cprobeTestApp.http = (port, sender, onSummary) => {

	mockServers.http(port, sender)
	.then(
		port => {

			const emitter = cprobe({
				json: true,
				urls: [
					`http://localhost:${port}`
				],
				interval: 0.1 * 1000,
				version:  false,
				display:  false
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
