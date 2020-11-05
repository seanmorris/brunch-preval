![avatar](https://avatars3.githubusercontent.com/u/640101?s=80&v=4)

# brunch-preval v0.0.1

Simple JS based preprocessing for Brunch static files.

[![seanmorris-shoutapi](https://img.shields.io/badge/seanmorris-brunch_preval-darkred?style=for-the-badge)](https://www.npmjs.com/package/brunch-preval) [![Size badge](https://img.shields.io/github/languages/code-size/seanmorris/brunch-preval?style=for-the-badge)](https://github.com/seanmorris/brunch-preval)

## Install

```bash
$ npm i brunch-preval
```

## Use

Simply put some javascript inside `{{ double curly braces }}`. The javascript will be evaluated, and the results will be interpolated in its place.

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

### Include/exclude

You can process more than just HTML files by specifying a regex for the `include` key.

Certain files by may be excluded by specifying a regex for the `exclude` key.

By default, `exclude` will be **empty** and `include` will be set to `/\.(?:html?|xml|svg|css|txt|md)?$/`.


```javascript
exports.plugins = {
	preval:{
		include: /\.(?:html?|xml|svg|css|txt|md)?$/,
		exclude: /something.xml$/,
	}
};
```

### Tokens

Tokens can be specified as well. Tokens may be static values or the results of a function. Dynamic tokens will be generated once per compile pass, and will have the same value for all files processed in each pass.

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

Set `log` to `false` to stop BrunchPreval from logging to the console.

```javascript
exports.plugins = {
	preval:{
		log: false
	}
};
```
