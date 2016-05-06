
"use strict"




const constants = require('../../src/commons/constants')
const cprobe    = require('../../src/app/cprobe')
const events     = require('events')
const express   = require('express')




const utils = { }





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

cprobeTestApp.http = (port, timeout, sender) => {

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

			return {emitter, server}

		})

}





const setup = { }

setup.http = ({port, timeout, sender, tests}) => {

	return new Promise((resolve, reject) => {

		mockServers.http(port, sender)
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

			return {emitter, server}

		})
		.then( ({emitter, server}) => {

			emitter.on(constants.events.summaries, summaries => {

				try {
					tests.forEach(test => test(summaries))
				} catch (err) {
					reject(err)
				}

			})

			setTimeout(( ) => server.close(resolve), timeout)

		})
		.catch(reject)

	})

}





module.exports = {
	cprobeTestApp,
	setup
}
