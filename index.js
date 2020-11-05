'use strict';

let logger;

const fs = require('fs');

try { logger = require('loggy') } catch (error) {};

class BrunchPreval
{
	constructor(config)
	{
		this.config         = config.plugins.preval || {};

		this.config.include = this.config.include || /\.(?:html?|xml|svg|css|txt|md)?$/;
		this.config.exclude = this.config.exclude || false;
		this.config.tokens  = this.config.tokens  || {};

		this.config.log = 'log' in this.config
			? this.config.log
			: true;
	}

	onCompile()
	{
		this.tokens = false;
	}

	compile({data, path})
	{
		return this.processFile({data, path});
	}

	compileStatic({data, path})
	{
		return this.processFile({data, path});
	}

	processFile({data, path})
	{
		// this.config.log && logger && logger.info(
		// 	'BrunchPreval is checking'
		// 	, path
		// 	, '...'
		// );

		if(this.config.exclude)
		{
			if(path.match(this.config.exclude))
			{
				return Promise.resolve({data, path});
			}
		}

		if(!path.match(this.config.include))
		{
			return Promise.resolve({data, path});
		}

		const _ = {};

		if(!this.tokens)
		{
			this.tokens = {};

			for(const token in this.config.tokens)
			{
				this.tokens[token] = this.config.tokens[token];

				if(typeof this.tokens[token] == 'function')
				{
					this.tokens[token] = this.tokens[token]();
				}

				this.config.log && logger && logger.info(
					'BrunchPreval 0.0.1 set token'
					, token
					, 'to'
					, this.tokens[token]
				);
			}
		}

		for(const token in this.config.tokens)
		{
			Object.defineProperty(_, token, {
				value: this.tokens[token]
			});
		}

		const escaped = /(?<!\\)((\\)+)/gi;
		const curly   = /(?<!\\)((?:\\{2})*){{(.+?)}}/gi;
		const angles  = /(?<!\\)((?:\\{2})*)<<<(.+?)>>>/gi;
		const round   = /(?<!\\)((?:\\{2})*)\(\(\((.+?)\)\)\)/gi;

		if(data.match(curly))
		{
			data = data.replace(
				curly,
				(r,escapes,code) => String(escapes || '') + eval(code)
			);

			this.config.log && logger && logger.info(
				'BrunchPreval is preprocessing curly braces from'
				, path
				, '...'
			);
		}

		if(data.match(angles))
		{
			data = data.replace(
				angles,
				(r,escapes,code) => String(escapes || '') + eval(code)
			);

			this.config.log && logger && logger.info(
				'BrunchPreval is preprocessing angle braces from'
				, path
				, '...'
			);
		}

		if(data.match(round))
		{
			data = data.replace(
				round,
				(r,escapes,code) => String(escapes || '') + eval(code)
			);

			this.config.log && logger && logger.info(
				'BrunchPreval is preprocessing round braces from'
				, path
				, '...'
			);
		}

		if(data.match(escaped))
		{
			data = data.replace(
				escaped,
				(r,escapes) => String(escapes || '').substr(Math.ceil(escapes.length/2))
			);

			this.config.log && logger && logger.info(
				'BrunchPreval is preprocessing escape characters from'
				, path
				, '...'
			);
		}

		return Promise.resolve({data, path});
	}
}

const type         = 'template';
const brunchPlugin = true;
const pattern      = /(?:.*)$/;

Object.assign(BrunchPreval.prototype, {
	brunchPlugin
	, pattern
	, type
});

module.exports = BrunchPreval;
