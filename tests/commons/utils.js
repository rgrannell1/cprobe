
"use strict"




const constants = require('../../src/commons/constants')
const cprobe    = require('../../src/app/cprobe')
const is        = require('is')
const events    = require('events')
const express   = require('express')




const utils = {
	constants: {
		timeouts: {
			http: 30 * 1000,
		},
		intervals: {
			probe: 0.1 * 1000
		}
	}
}









utils.assertSchema = (schema, value) => {

	Object.keys(schema).forEach(property => {

		if (property === 'type') {

			if (is.array(schema.type)) {

				const match = schema.type.filter(possible => is[possible](value))

				if (match.length === 0) {
					throw `value did not have type in list ${schema.type.join(', ')}`
				}

			} else {

				is.always[schema.type](value)

			}

		} else if (property === 'children') {

			if (is.array(value)) {

				value.forEach((elem, ith) => {
					try {
						utils.assertSchema(schema.children, elem)
					} catch (err) {
						err.message = `${ith} child element is invalid: ${err.message}`
					}
				})

			} else if (is.object(value)) {

				Object.keys(value).forEach(innerProp => {
					try {
						utils.assertSchema(schema, value[innerProp])
					} catch (err) {
						err.message = `${innerProp} is invalid: ${err.message}`
					}
				})

			}


		} else {

			if (!value.hasOwnProperty(property)) {
				throw Error(`missing property ${property}:\nvalue ${JSON.stringify(property)}`)
			} else {
				try {
					utils.assertSchema(schema[property], value[property])
				} catch (err) {
					err.message = `${property} is invalid: ${err.message}`
				}
			}

		}

	})

}






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

		server.timeout = utils.constants.timeouts.http

	})

}

utils.cprobeTestApp = { }

utils.cprobeTestApp.http = (port, timeout, sender) => {

	return mockServers.http(port, sender)
		.then(server => {

			const emitter = cprobe({
				json: true,
				urls: [
					`localhost:${port}`
				],
				interval: constants.intervals.probe,
				version:  false,
				display:  false,
				timeout:  timeout
			})

			return {emitter, server}

		})
		.catch(err => {
			console.err(err.message)
		})

}





utils.setup = { }

utils.setup.http = ({port, timeout, sender, tests}) => {

	return new Promise((resolve, reject) => {

		mockServers.http(port, sender)
		.then(server => {

			const emitter = cprobe({
				json: true,
				urls: [
					`localhost:${port}`
				],
				interval: constants.intervals.probe,
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





module.exports = utils
