
"use strict"




const metrics = require('../metrics/metrics')





const measureResponse = (event, response) => {
	return measureResponse[response.url.protocol](event, response)
}

measureResponse.http = (event, response) => {

	const urlResponse = response.res
	const urlBody     = response.body

	const resMetrics     = { }
	const resMetricNames = ['responseTimeMs', 'statusCode', 'bodyLength']

	resMetricNames.forEach(name => {
		resMetrics[name] = metrics[name](response)
	})

	return {
		event,
		url:     response.url,
		time:    response.time,
		metrics: resMetrics
	}

}

measureResponse.https = measureResponse.http

measureResponse.ssh = (event, response) => {

	return {
		event,
		url: response.url,
		time: Date.now( ),
		metrics: {

		}
	}

}






module.exports = measureResponse
