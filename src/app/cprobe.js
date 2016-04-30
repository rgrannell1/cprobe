
"use strict"




const parseUrl           = require('../app/parse-url')
const testUrlStatuses    = require('../app/test-url-statuses')
const constants          = require('../commons/constants')
const monitorUrls        = require('../app/monitor-urls')





const cprobe = rawArgs => {

	const args         = cprobe.preprocess(rawArgs)
	const connStatuses = testUrlStatuses(args, args.urls)

	if (args.version) {
		console.log(constants.packageJson.version)
		process.exit(0)
	}

	return monitorUrls(connStatuses)

}

cprobe.preprocess = rawArgs => {

	return {
		urls:     cprobe.preprocess.urls(rawArgs['<url>']),
		interval: cprobe.preprocess.interval(rawArgs['--interval']),
		version:  rawArgs['--version']
	}

}

cprobe.preprocess.urls = urls => {
	return urls.map((url, ith) => {
		return Object.assign(parseUrl(url), {id: ith})
	})
}

cprobe.preprocess.interval = interval => {

	const value = parseInt(interval, 10) * constants.units.millisecondsPerSecond

	if (value !== value) {
		console.error('error: failed to parse --interval')
		process.exit(1)
	}

	return value

}






module.exports = cprobe
