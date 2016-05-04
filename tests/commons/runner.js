
"use strict"




const Mocha = require('mocha')
const fs    = require('fs')
const path  = require('path')





const mocha = new Mocha( )




const testDir = path.join(path.dirname(__dirname), 'cases')



fs.readdirSync(testDir).filter(function (file) {
	return path.extname(file) === '.js'
}).forEach(function (file) {
	mocha.addFile(path.join(testDir, file))
})





mocha.run(function (failures) {
	process.on('exit', function ( ) {
		process.exit(failures)
	})
})
