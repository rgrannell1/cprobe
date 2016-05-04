
"use strict"




const constants = require('../../src/commons/constants')
const cprobe    = require('../../src/app/cprobe')
const express   = require('express')





const mockServers = { }

mockServers.http = (port, sender) => {

	return new Promise((resolve, reject) => {

		const server = express( )
			.get('*', (req, res) => {
				sender(req, res)
			})
			.listen(port, ( ) => {
				resolve(server)
			})

	})

}

const cprobeTestApp = { }

cprobeTestApp.http = (port, timeout, sender, onSummary) => {

	return mockServers.http(port, sender)
		.then(server => {

			const emitter = cprobe({
				json: true,
				urls: [
					`http://localhost:${port}`
				],
				interval: 0.1 * 1000,
				version:  false,
				display:  false,
				timeout:  timeout
			})

			emitter.on(constants.events.summaries, onSummary)

			return {emitter, server}

		})

}

cprobeTestApp.ssh = (port, onSummary) => {

}




module.exports = {
	cprobeTestApp
}
