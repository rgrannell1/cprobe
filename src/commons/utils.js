
"use strict"





const constants = require('../commons/constants')





const utils = {
	terminal: { }
}

utils.terminal.eraseLines = count => {

	for (var ith = 0; ith < count; ++ith) {
		process.stderr.write(constants.escapeSequences.lineUp)
		process.stderr.write(constants.escapeSequences.lineDelete)
	}

}




utils.tabulate = elems => {

	var entries = [ ]

	elems.forEach(elem => {

		var matched = false

		entries.forEach(entry => {


			if (entry.value === elem) {
				++entry.count
				matched = true
			}

		})

		if (!matched) {
			entries.push({
				value: elem,
				count: 1
			})
		}

	})

	return entries

}

utils.pluck = (key, coll) => coll.map(elem => elem[key])





Object.defineProperty(Array.prototype, 'groupBy', {
	enumerable: false,
	value: function (fn) {

		var table = { }

		this.forEach(elem => {

			const key  = fn(elem)
			table[key] = (table[key] || [ ]).concat(elem)

		})

		return table

	}
})

Object.defineProperty(Object.prototype, 'unzipKeys', {

	enumerable: false,
	value: function ( ) {
		return Object.keys(this).map( key => [key, this[key]] )
	}

})





module.exports = utils
