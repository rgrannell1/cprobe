#!/usr/bin/env node

"use strict"





const colors    = require('colors')
const constants = require('../commons/constants')





const docs = `
Name:
	cprobe — test network connections to a URL.
Usage:
	cprobe [-i <NUM> | --interval <NUM>] [-j | --json] [-h | --human] [--] <url>...
	cprobe (-h | --help | --version)

Description:

	cprobe is a primarily interactive tool for testing connections to provided URLs. Its envisaged uses are to:

	* replace manual CURL testing during installation / reconfiguration.
	* test and measure network reliability.

	cprobe works supports common protocols (http, https, ssh).

Options:
	-j, --json                    Display the connection statuses as line-delimited JSON.
	-i <NUM>, --interval <NUM>    The probe interval [default: 5].
	-h, --help                    Display this documentation.
	--version                     Display the package version.
Arguments:
	<url>...                      The URLs to test the connection status of. Each URL must include it's protocol (e.g. http://example.com)
	                              The folloring protocols are currently supported:
	                              * http
	                              * https


Authors:
	${constants.packageJson.author}

Version:
	v${constants.packageJson.version}
`




const docopt       = require('docopt').docopt
const callApp      = require('../cli/call-app')





callApp( Object.assign({
	'--display': true
}, docopt(docs)) )
