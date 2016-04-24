
"use strict"




const parseUrl  = require('../app/parse-url')
const probeUrls = require('../app/probe-urls')





const cprobe = rawArgs => {

	const args = cprobe.preprocess(rawArgs)

	probeUrls(args, args.urls)

}

cprobe.preprocess = rawArgs => {

	return {
		urls: cprobe.preprocess.urls(rawArgs['<url>'])
	}

}

cprobe.preprocess.urls = urls => {
	return urls.map(parseUrl)
}





module.exports = cprobe
