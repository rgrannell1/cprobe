
"use strict"






const responseStats = (event, response) => {
	return responseStats[response.url.protocol](event, response)
}

responseStats.http = (event, response) => {

	return {
		event,
		url:  response.url,
		time:    response.time,
		metrics: {
			responseTime: response.res
				? response.res.responseTime
				: null,
			status:     response.res
				? response.res.statusCode
				: null,
			bodyLength: response.body
				? response.body.length
				: null
		}
	}

}

responseStats.https = responseStats.http





module.exports = responseStats
