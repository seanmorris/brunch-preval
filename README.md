![avatar](https://avatars3.githubusercontent.com/u/640101?s=80&v=4)

# brunch-preval v0.0.3

Simple JS based preprocessing for Brunch static HTML files.

[![seanmorris-brunch-preval](https://img.shields.io/badge/seanmorris-brunch_preval-darkred?style=for-the-badge)](https://www.npmjs.com/package/brunch-preval) [![Size badge](https://img.shields.io/github/languages/code-size/seanmorris/brunch-preval?style=for-the-badge)](https://github.com/seanmorris/brunch-preval)

## Install

```bash
$ npm i brunch-preval
```

## Use

Simply open a static HTML file and put some javascript inside `{{ double curly braces }}`. The javascript will be evaluated, and the results will be interpolated in its place.

```html
<html><body>{{ Math.random() }}</body></html>
```

## Escaping

Use the backslash (`\`) character to escape a replacement

```html
<html><body>\{{ This won't be processed. }}</body></html>
```

### Escaping Escapes

Backslashes may also be used to escape a backslash.

```html
<html>
<body>
	{{ "This WILL be processed." }}
	\{{ "This won't be processed."" }}
	\\{{ "This WILL be processed and will be preceeded by a single backslash." }}
	\\\{{ "This won't be processed and will be preceeded by a single backslash." }}
	\\\\{{ "This WILL be processed and will be preceeded by a 2 backslashes." }}
</body>
</html>
```

### Alt Notation

`<<< triple angle brackets >>>` or `((( triple parens )))`  may also be used.

## Configure

See also [configuring Brunch](https://brunch.io/docs/config)

### Include/exclude

You can more finely control which HTML files are processed by specifying a regex for the `include` & `exclude` keys.

If a file matches both `include` and `exclude` the `include` will take precedence.

```javascript
exports.plugins = {
	preval:{
		exclude: /thing.html$/,
		, include: /something.html$/,
	}
};
```

### Tokens

Tokens can be specified in your Brunch config.

Tokens may be static values or the results of a function. Dynamic tokens will be generated once per compile pass, and will have the same value for all files processed in each pass.

Tokens in templates can be accessed on the `_` object.

```html
<html><body>{{ _.BUILD_TIME }}</body></html>
```

```javascript
exports.plugins = {
	preval:{
		tokens: {
			STATIC_VAL: 'Some value',
			BUILD_TIME: ()=>(new Date).getTime() / 1000,
		}
	}
};
```

### Suppress Logging

Set `log` to `false` in your Brunch config to stop BrunchPreval from logging to the console during compilation.

```javascript
exports.plugins = {
	preval:{
		log: false
	}
};
```
