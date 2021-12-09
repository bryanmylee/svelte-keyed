# svelte-keyed

[![npm version](http://img.shields.io/npm/v/svelte-keyed.svg)](https://www.npmjs.com/package/svelte-keyed)
[![npm downloads](https://img.shields.io/npm/dm/svelte-keyed.svg)](https://www.npmjs.com/package/svelte-keyed)
![license](https://img.shields.io/npm/l/svelte-keyed)
![build](https://img.shields.io/github/workflow/status/bryanmylee/svelte-keyed/publish)
[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-keyed/badge.svg?branch=master)](https://coveralls.io/github/bryanmylee/svelte-keyed?branch=master)
[![size](https://img.shields.io/bundlephobia/min/svelte-keyed)](https://bundlephobia.com/result?p=svelte-keyed)

A **writable** derived store for objects and arrays!

```js
const name = writable({ first: "Rich", last: "Harris" });
const firstName = keyed(name, "first");
$firstName = "Bryan";
console.log($name); // { first: "Bryan", last: "Harris" };

const history = writable(["one", "two", "three"]);
const previousEdit = indexed(history, 1);
$previousEdit = "four";
console.log($history); // ["one", "four", "three"];
```

## Installation

```bash
$ npm i -D svelte-keyed
```

Since Svelte automatically bundles all required dependencies, you only need to install this package as a dev dependency with the `-D` flag.

## API

`keyed` takes a writable object store and a property name, while `indexed` takes a writable array store and an index value.

Both return a writable store whose **changes are reflected on the original store**.
