'use strict';

let logger;

try { logger = require('loggy'); } catch (error) {};

class BrunchPreval
{
	constructor(config)
	{
		this.config         = config.plugins.preval || {};

		this.config.include = this.config.include || /\.html?$/;
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
		if(!path.match(this.config.include))
		{
			return;
		}

		if(this.config.exclude)
		{
			if(path.match(this.config.exclude))
			{
				return;
			}
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
					'BrunchPreval set token'
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

		this.config.log && logger && logger.info(
			'BrunchPreval is preprocessing'
			, path
		);

		data = data.replace(
			/(?:<<|{{)(.+?)(?:}}|>>)/gi
			, (r,code) => eval(code)
		);

		return Promise.resolve({data, path});
	}
}

Object.assign(BrunchPreval.prototype, {
	staticTargetExtension: e => e
	, brunchPlugin: true
	, pattern: /\.(\w+)$/
	, type: 'template'
});

module.exports = BrunchPreval;
