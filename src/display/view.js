
"use strict"




const view = { }




view.carraigeReturn = urlSummaries => {

	urlSummaries.forEach(urlSummary => {

		console.log(urlSummary.header)

	})

}

view.json = ({content}) => {
	console.log(content)
}





module.exports = view
