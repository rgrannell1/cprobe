
"use strict"




const httpRequest = require('request')
const sshRequest  = require('ssh2').Client




const connect = { }

connect.http = connData => {

	return new Promise((resolve, reject) => {
		httpRequest(connData.url, (err, res, body) => {
			err ? reject(err) : resolve(res, body)
		})
	})

}

connect.https = connect.http





module.exports = connect
