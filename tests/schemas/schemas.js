
"use strict"






const schemas = { }






schemas.http = ( ) => {

	const url = {
		id: {
			type: 'number'
		},
		protocol: {
			type: 'string'
		},
		url: {
			type: 'string'
		}
	}

	const stats = {
		successPercentage: {
			type: 'number'
		},
		count: {
			type: 'number'
		},
		responseTimeMs: {
			'median': {
				type: ['null', 'number']
			}
		},
		responseCodes: {
			type: 'array',
			children: {
				value: {
					type: 'number'
				},
				count: {
					type: 'number'
				}
			}
		}
	}

	const summaries = {
		type: 'array',
		children: {
			intervalMs: {
				type: 'number',
			},
			stats
		}
	}

	return {
		type: 'array',
		children: {
			url:       url,
			summaries: summaries
		}
	}

}

schemas.https = schemas.http





module.exports = schemas
