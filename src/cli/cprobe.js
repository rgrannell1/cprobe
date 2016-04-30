#!/usr/bin/env node

"use strict"





const constants = require('../commons/constants')





const docs = `
Name:
	cprobe — monitor the connection status to a URL.
Usage:
	cprobe [-i <NUM> | --interval <NUM>] <url>...
	cprobe (-h | --help | --version)

Description:
	*

Options:
	-i <NUM>, --interval <NUM>    The probe interval [default: 1].
	-h, --help                    Display this documentation.
	--version                     Display the package version.
Arguments:
	<url>...      .
Version:
	v${constants.packageJson.version}
`




const docopt = require('docopt').docopt
const cprobe = require('../app/cprobe')




cprobe(docopt(docs))
