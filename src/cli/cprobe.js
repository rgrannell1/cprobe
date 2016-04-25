#!/usr/bin/env node

"use strict"





const constants = require('../commons/constants')





const docs = `
Name:
	cprobe — monitor the connection status to a URL.
Usage:
	cprobe [-l <LABEL> | --label <LABEL>] <url>...
	cprobe (-h | --help | --version)
Description:
	*
Options:
	-l <LABEL>, --label <LABEL>    A label to display. Defaults to the provided URLs.
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
