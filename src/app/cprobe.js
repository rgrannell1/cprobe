
"use strict"




const parseUrl           = require('../app/parse-url')
const probeUrls          = require('../app/probe-urls')
const constants          = require('../commons/constants')
const monitorConnections = require('../app/monitor-connections')





const cprobe = rawArgs => {

	const args         = cprobe.preprocess(rawArgs)
	const connStatuses = probeUrls(args, args.urls)

	if (args.version) {
		console.log(constants.packageJson.version)
		process.exit(0)
	}

	return monitorConnections(connStatuses)

}

cprobe.preprocess = rawArgs => {

	return {
		urls:    cprobe.preprocess.urls(rawArgs['<url>']),
		version: rawArgs['--version']
	}

}

cprobe.preprocess.urls = urls => {
	return urls.map((url, ith) => {
		return Object.assign(parseUrl(url), {id: ith})
	})
}





module.exports = cprobe
