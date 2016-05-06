
"use strict"




const constants = require('../../src/commons/constants')
const cprobe    = require('../../src/app/cprobe')
const is        = require('is')
const events    = require('events')
const express   = require('express')




const utils = { }





utils.assertSchema = (schema, value) => {

	Object.keys(schema).forEach(property => {

		if (property === 'type') {

			is.always[schema.type](value)

		} else if (property === 'children') {

			if (is.array(value)) {

				value.forEach(elem => {
					utils.assertSchema(schema.children, elem)
				})

			} else if (is.object(value)) {

				Object.keys(value).forEach(innerProp => {
					utils.assertSchema(schema, value[innerProp])

				})

			}


		} else {

			if (!value.hasOwnProperty(property)) {
				throw Error(`missing property ${property}:\nvalue ${JSON.stringify(property)}`)
			} else {
				utils.assertSchema(schema[property], value[property])
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
				interval: 0.1 * 1000,
				version:  false,
				display:  false,
				timeout:  timeout
			})

			return {emitter, server}

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





module.exports = utils
