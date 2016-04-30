
"use strict"





const events    = require('events')

const connect   = require('../app/connect')
const constants = require('../commons/constants')






const connHandlers = {
	http: { },
	ssh:  { }
}

connHandlers.http.resolve = (emitter, url, {res, body}) => {
	emitter.emit(constants.events.connSuccess, {
		url, res, body, time: Date.now( )
	})
}

connHandlers.http.reject = (emitter, url, err) => {
	emitter.emit(constants.events.connFailure, {
		url, err, time: Date.now( )
	})
}

connHandlers.https = connHandlers.http

connHandlers.ssh.resolve = (emitter, url) => {
	emitter.emit(constants.events.connSuccess, {
		url, time: Date.now( )
	})
}

connHandlers.ssh.reject = (emitter, url, err) => {
	emitter.emit(constants.events.connFailure, {
		url, err, time: Date.now( )
	})
}





const testUrlStatus = (args, emitter, url) => {

	setInterval(( ) => {

		const connPromise = connect[url.protocol](url)

		connPromise.then(
			connHandlers[url.protocol].resolve.bind({ }, emitter, url),
			connHandlers[url.protocol].reject .bind({ }, emitter, url)
		)
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
