![svelte-keyed-banner](https://user-images.githubusercontent.com/42545742/145455110-0d90603a-5fb3-453a-a9ea-7c4e3b443913.png)

# svelte-keyed

[![npm version](http://img.shields.io/npm/v/svelte-keyed.svg)](https://www.npmjs.com/package/svelte-keyed)
[![npm downloads](https://img.shields.io/npm/dm/svelte-keyed.svg)](https://www.npmjs.com/package/svelte-keyed)
![license](https://img.shields.io/npm/l/svelte-keyed)
![build](https://img.shields.io/github/workflow/status/bryanmylee/svelte-keyed/publish)
[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-keyed/badge.svg?branch=main)](https://coveralls.io/github/bryanmylee/svelte-keyed?branch=main)
[![size](https://img.shields.io/bundlephobia/min/svelte-keyed)](https://bundlephobia.com/result?p=svelte-keyed)

A **writable** derived store for objects and arrays!

```js
const user = writable({ name: { first: 'Rich', last: 'Harris' } });
const firstName = keyed(user, 'name.first');

$firstName = 'Bryan';

console.log($user); // { name: { first: 'Bryan', last: 'Harris' } };
```

## Installation

```bash
$ npm i -D svelte-keyed
```

Since Svelte automatically bundles all required dependencies, you only need to install this package as a dev dependency with the `-D` flag.

## API

`keyed` takes a writable object store and a **keypath**, and returns a writable store whose _changes are reflected on the original store_.

### Nullable parents

If the parent store is nullable, then the child store will also be nullable.

```ts
const user = writable<User | undefined>(undefined);
const firstName = keyed(user, 'name.first'); // string | undefined
```

### Nested objects

To access a nested object, provide a keypath.

Properties are accessed with dot notation, and arrays can be indexed with bracket notation.

```js
const email = keyed(settings, 'profiles[0].email');
```

## Motivations

We usually read and write properties of an object store with [auto-subscriptions](https://svelte.dev/tutorial/auto-subscriptions).

```svelte
<input bind:value={$name.first}/>
```

However, auto-subscriptions are isolated to a Svelte component. `svelte-keyed` aims to solve several common limitations listed below.

### Context stores

Often, we want to set a property or element of a store into component context, then allow child components to read / write to the property.

```svelte
<!-- Settings.svelte -->
<script>
  setContext('profileSettings', keyed(settings, 'profile'));
</script>

<GeneralSettings />
<ProfileSettings />
```

```svelte
<!-- ProfileSettings.svelte -->
<script>
  const profileSettings = getContext('profileSettings');
</script>

<input type="text" bind:value={$profileSettings.username} />
```

### Helper functions

One important method to reduce clutter on your component is to extract functionality into external helper functions. `svelte-keyed` allows you to create derived `Writable` stores that can be passed into or returned from helper functions.

```svelte
<!-- Settings.svelte -->
<script>
  const stats = writable({ userClicks: 0, userTaps: 0 });
  const clicks = keyed(stats, 'userClicks');
</script>

<div use:trackClicks={clicks} />
<input use:trackClicks={clicks} />
```

```js
export const trackClicks = (node, clicks) => {
  const listen = () => {
    clicks.update(($clicks) => $clicks + 1);
  };
  node.addEventListener('click', listen);
  return {
    destroy() {
      node.removeEventListener('click', listen);
    },
  };
};
```
