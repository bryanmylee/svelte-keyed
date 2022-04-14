import { derived } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';
import type { Get } from 'type-fest';

export const getTokens = (key: string): string[] => {
	let keyWithoutBracket = key.replace(/\[(\d+)\]/g, '.$1');
	if (keyWithoutBracket.startsWith('.')) {
		keyWithoutBracket = keyWithoutBracket.slice(1);
	}
	return keyWithoutBracket.split('.');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNested = (root: unknown, keyTokens: string[]): any => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let current: any = root;
	for (const key of keyTokens) {
		if (current == null) {
			break;
		}
		current = current[key];
	}
	return current;
};

const clonedWithPrototype = <T extends object>(source: T): T => {
	const clone = Object.create(source);
	Object.assign(clone, source);
	return clone;
};

export function keyed<Parent extends object, Key extends string>(
	parent: Writable<Parent>,
	key: Key
): Writable<Get<Parent, Key>>;

export function keyed<Parent extends object, Key extends string>(
	parent: Writable<Parent | undefined | null>,
	key: Key
): Writable<Get<Parent, Key> | undefined>;

export function keyed<Parent extends object, Key extends string>(
	parent: Writable<Parent | undefined | null>,
	key: Key
): Writable<Get<Parent, Key> | undefined> {
	const keyTokens = getTokens(key);
	if (keyTokens.some((token) => token === '__proto__')) {
		throw new Error('key cannot include "__proto__"');
	}
	const branchTokens = keyTokens.slice(0, keyTokens.length - 1);
	const leafToken = keyTokens[keyTokens.length - 1];

	const keyedValue = derived(parent, ($parent) =>
		getNested($parent, keyTokens)
	);

	const set = (value: Get<Parent, Key>) => {
		parent.update(($parent) => {
			if ($parent == null) {
				return undefined as unknown as Parent;
			}
			const newParent = Array.isArray($parent)
				? [...$parent]
				: clonedWithPrototype($parent);
			getNested(newParent, branchTokens)[leafToken] = value;
			return newParent as Parent;
		});
	};

	const update = (fn: Updater<Get<Parent, Key>>) => {
		parent.update(($parent) => {
			if ($parent == null) {
				return undefined as unknown as Parent;
			}
			const newValue = fn(getNested($parent, keyTokens));
			const newParent = Array.isArray($parent)
				? [...$parent]
				: clonedWithPrototype($parent);
			getNested(newParent, branchTokens)[leafToken] = newValue;
			return newParent as Parent;
		});
	};

	return {
		subscribe: keyedValue.subscribe,
		set,
		update,
	};
}
