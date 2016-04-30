
"use strict"






const responseStats = (event, response) => {
	return responseStats[response.url.protocol](event, response)
}

responseStats.http = (event, response) => {

	const urlResponse = response.res
	const urlBody     = response.body

	return {
		event,
		url:     response.url,
		time:    response.time,
		metrics: {
			responseTime: urlResponse
				? urlResponse.responseTime
				: null,
			status:  urlResponse
				? urlResponse.statusCode
				: null,
			bodyLength: response.body
				? urlBody.length
				: null
		}
	}

}

responseStats.https = responseStats.http

responseStats.ssh = (event, response) => {

	return {
		event,
		url: response.url,
		time: Date.now( ),
		metrics: {

		}
	}

}






module.exports = responseStats
