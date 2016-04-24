#!/usr/bin/env node

"use strict"





const constants = require('../commons/constants')





const docs = `
Name:
	cprobe — monitor the connection status to a URL.
Usage:
	cprobe <url>...
	cprobe (-h | --help | --version)
Description:
	*
Options:
	-h, --help    Display this documentation.
	--version     Display the package version.
Arguments:
	<url>...      .
Version:
	v${constants.packageJson.version}
`




const docopt = require('docopt').docopt
const cprobe = require('../app/cprobe')




cprobe(docopt(docs))
