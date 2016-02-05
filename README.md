[![npm Version](https://img.shields.io/npm/v/object-path-expand.svg)](https://www.npmjs.com/package/object-path-expand)
[![Build Status](https://travis-ci.org/svenschoenung/object-path-expand.svg?branch=master)](https://travis-ci.org/svenschoenung/object-path-expand)
[![Coverage Status](https://coveralls.io/repos/github/svenschoenung/object-path-expand/badge.svg?branch=master)](https://coveralls.io/github/svenschoenung/object-path-expand?branch=master)
[![Dependency Status](https://david-dm.org/svenschoenung/object-path-expand.svg)](https://david-dm.org/svenschoenung/object-path-expand)
[![devDependency Status](https://david-dm.org/svenschoenung/object-path-expand/dev-status.svg)](https://david-dm.org/svenschoenung/object-path-expand#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/svenschoenung/object-path-expand/badges/gpa.svg)](https://codeclimate.com/github/svenschoenung/object-path-expand)


# object-path-expand

Expand JS objects containing deep path properties.

## Installation

```
npm install object-path-expand --save
```

## Usage

```js
> var expand = require('object-path-expand')
```

Deep paths in object properties are expanded 
(using [object-path](https://github.com/mariocasciaro/object-path)):

```js
> expand({ 'foo.bar' : 42 })
{ 'foo' : { 'bar': 42 } }
> expand({ 'foo.2.bar' : 42 })
{ 'foo': [ , , { 'bar': 42 } ] }
> expand({ 'foo.bar': 42, 'foo.quux': 23 })
{ 'foo': { 'bar': 42, 'quux': 23 } }
```

Expanded objects are recursively merged 
(using [merge](https://github.com/yeikos/js.merge)):

```js
> expand({ 'foo' : { 'bar': 42 }, 'foo.quux': 23 })
{ 'foo': { 'bar': 42, 'quux': 23 } }
> expand({ 'foo.quux': 23, 'foo': { 'bar': 42 } })
{ 'foo': { 'bar': 42, 'quux': 23 } }
```

**HERE BE DRAGONS**

Since iteration order for properties of JS objects is unspecified and
can differ between JS implementations, strange things might happen if two
different paths refer to the same object:

```js
> expand({ 'foo.bar': { 'quux': 42 }, 'foo': { 'bar.quux': 23 } })
// Depending on the JS engine this could result in either of these:
// { 'foo': { 'bar': { 'quux': 42 } } }
// { 'foo': { 'bar': { 'quux': 23 } } }

> expand({ 'foo': { 'bar.quux': 23 }, 'foo.bar': { 'quux': 42 } })
// Switching the order of the two properties might or might not
// yield a different result than the previous one above
```

Even stranger things might happen if two things cannot be sensibly merged:

```js
> expand({ 'foo': [ 'a', 'b' ], 'foo.bar': 23 })
// Depending on the JS engine this could result in either of these:
// { 'foo': { '0': 'a', '1': 'b', 'bar': 23 } }
// { 'foo': { 'bar': 23 } }

> expand({ 'foo.bar': 23, 'foo': [ 'a', 'b' ] })
// Again, switching the order of the two properties above
// might yield a different result than it did previously
```

Proceed at your own peril.

## License

[MIT](LICENSE)
