
"use strict"




const utils = {

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

utils.partition = (fn, coll) => {

	var table = { }

	coll.forEach(elem => {

		const key  = fn(elem)
		table[key] = (table[key] || [ ]).concat(elem)

	})

	return table

}



module.exports = utils