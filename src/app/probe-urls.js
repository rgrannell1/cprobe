
"use strict"





const events    = require('events')

const connect   = require('../app/connect')
const constants = require('../commons/constants')




const probeUrls = (args, urls) => {

	const connStatuses = new events.EventEmitter( )

	urls.forEach(url => {

		setInterval(( ) => {

			connect[url.protocol](url)
				.then(
					(res, body) => {
						connStatuses.emit(constants.events.connSuccess, {
							url, res, body, time: Date.now( )
						})
					},
					err => {
						connStatuses.emit(constants.events.connFailure, {
							url, err, time: Date.now( )
						})
					}
				)
				.catch(err => {

					console.error(`internal error: ${err.stack}`)
					process.exit(1)
				})

		}, 3 * 1000)

	})

	return connStatuses

}





module.exports = probeUrls
