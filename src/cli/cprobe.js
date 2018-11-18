#!/usr/bin/env node

'use strict'

const constants = require('../commons/constants')

const docs = `
Name:
	cprobe — test network connections to a URL.
Usage:
	cprobe [-i <NUM> | --interval <NUM>] [-j | --json] [--http-proxy] [--https-proxy] [--no-proxy] [--] <url>...
	cprobe (-h | --help | --version)

Description:

	cprobe is a primarily interactive tool for testing connections to provided URLs. Its envisaged uses are to:

	* replace manual CURL testing during installation / reconfiguration.
	* test and measure network reliability.
	* auto-detect proxies.

	cprobe works supports common protocols (http, https, ssh, tcp).

Options:
	-h, --help                    Display this documentation.
	--version                     Display the package version.

Display Options:
	-j, --json                    Display the connection statuses as line-delimited JSON.

Connection Options:
	-i <NUM>, --interval <NUM>    The probe interval [default: 5].

Proxy Options:

	--http-proxy  <STR>           The https proxy to use. Proxy settings are automatically detected from the
	                                  environmental variables 'HTTP_PROXY', 'HTTPS_PROXY', and 'NO_PROXY', but
	                                  supplied proxy options are treated with higher-priority.
	--https-proxy <STR>           The https proxy to use. See above.

	--no-proxy                    Do not use a HTTP proxy.

Arguments:
	<url>...                      The URLs to test the connection status of. Each URL must include its protocol (e.g. http://example.com)
	                              The folloring protocols are currently supported:
	                                  * http (automatic)
	                                  * https
	                                  * ssh

Authors:
	${constants.packageJson.author}

Version:
	v${constants.packageJson.version}
`

const docopt = require('docopt').docopt
const callApp = require('../cli/call-app')

const args = Object.assign({
  '--display': true
}, docopt(docs))

callApp(args)
