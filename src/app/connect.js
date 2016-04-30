
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

			res.responseTime = parseInt(process.hrtime(start)[1] / constants.units.nanosecondsPerSecond, 10)

			resolve(res, body)

		})

	})

}

connect.https = connect.http





module.exports = connect
