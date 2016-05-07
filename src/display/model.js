
"use strict"





const model = { }




model.carraigeReturn = urlSummaries => {

	const data = [ ]

	urlSummaries.forEach(urlSummary => {

		data.push({
			header: urlSummary.url.url,
			fields: {
				'response time': 10,
				'attempts':      10
			},
			summaries: urlSummary.summaries
		})

	})

	return data

}

model.json = urlSummaries => {

	return {
		content: JSON.stringify(urlSummaries)
	}

}





module.exports = model
