
"use strict"





const events    = require('events')

const connect   = require('../app/connect')
const constants = require('../commons/constants')






const testUrlStatus = (args, emitter, url) => {

	setInterval(( ) => {

		const connPromise = connect[url.protocol](url)

		connPromise.then(
			(res, body) => {
				emitter.emit(constants.events.connSuccess, {
					url, res, body, time: Date.now( )
				})
			},
			err => {
				emitter.emit(constants.events.connFailure, {
					url, err, time: Date.now( )
				})
			})
			.catch(err => {

				console.error(`internal error: ${err.stack}`)
				process.exit(1)

			})

	}, args.interval)

}

const testUrlStatuses = (args, urls) => {

	const urlStatuses = new events.EventEmitter( )

	urls.forEach(url => {
		testUrlStatus(args, urlStatuses, url)
	})

	return urlStatuses

}





module.exports = testUrlStatuses
