
"use strict"





const events  = require('events')

const connect = require('../app/connect')





const probeUrls = (args, urls) => {

	const emitter = new events.EventEmitter( )

	urls.forEach(url => {

		connect[url.protocol](url).then(
			(res, body) => {
				emitter.emit(constants.events.connSuccess, {
					url, res, body
				})
			},
			err => {
				emitter.emit(constants.events.connFailure, {
					url, err
				})
			}
		)

	})

}





module.exports = probeUrls
