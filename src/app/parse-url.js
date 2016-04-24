
"use strict"



const url       = require('url')
const sshUrl    = require('ssh-url')

const constants = require('../commons/constants')
const utils     = require('../commons/utils')





const parseUrl = url => {

	if (!constants.regex.protocol.test(url)) {
		console.error(`error: failed to detect protocol in URL ${url}`)
		process.exit(1)
	}

	const protocol = url.match(constants.regex.protocol)[1]

	if (!parseUrl.hasOwnProperty(protocol)) {
		console.error(`error: the ${protocol} protocol is not supported.`)
		process.exit(1)
	}

	return parseUrl[protocol](url)

}

parseUrl.http  = url => {
	return {protocol: 'http', url}
}

parseUrl.https = url => {
	return {protocol: 'https', url}
}





module.exports = parseUrl
