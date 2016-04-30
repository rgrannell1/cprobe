
"use strict"





const constants   = require('../commons/constants')
const httpRequest = require('request')
const sshRequest  = require('ssh2').Client




const connect = { }

connect.http = connData => {

	return new Promise((resolve, reject) => {

		const start = process.hrtime( )

		httpRequest(connData.url, (err, res, body) => {

			if (err) {
				return reject(err)
			}

			res.responseTime = parseInt(process.hrtime(start)[1] / constants.units.nanosecondsPerMillisecond, 10)

			resolve({res, body})

		})

	})

}

connect.https = connect.http

connect.ssh = connData => {

	return new Promise((resolve, reject) => {

		const start = process.hrtime( )

		const conn = new sshRequest( )

		conn
		.on('ready', ( ) => {
			resolve({

			})
		})
		.on('error', err => {
			console.log(err)
			reject(err)
		})
		.connect({
			host:     connData.hostname,
			port:     connData.port,
			username: connData.username
		})

		httpRequest(connData.url, (err, res, body) => {

			if (err) {
				return reject(err)
			}

			res.responseTime = parseInt(process.hrtime(start)[1] / constants.units.nanosecondsPerMillisecond, 10)

			resolve(res, body)

		})

	})

}






module.exports = connect
