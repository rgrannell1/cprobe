
"use strict"






const extractMetrics = (event, response) => {
	return extractMetrics[response.url.protocol](event, response)
}

extractMetrics.http = (event, response) => {

	return {
		event,
		url:  response.url,
		time: response.time,
		info: {
			status:     response.res
				? response.res.statusCode
				: null,
			bodyLength: response.body
				? response.body.length
				: null
		}
	}

}

extractMetrics.https = extractMetrics.http





module.exports = extractMetrics
