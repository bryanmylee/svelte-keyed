import { derived } from "svelte/store";
import type { Updater, Writable } from "svelte/store";

export function keyed<Parent>(
  parent: Writable<Parent>,
  key: keyof Parent
): Writable<Parent[keyof Parent]>;
export function keyed<Parent>(
  parent: Writable<Parent | undefined | null>,
  key: keyof Parent
): Writable<Parent[keyof Parent] | undefined>;

export function keyed<Parent>(
  parent: Writable<Parent | undefined | null>,
  key: keyof Parent
): Writable<Parent[keyof Parent] | undefined | null> {
  type Child = Parent[keyof Parent];

  const keyedValue = derived(parent, ($parent) => {
    if ($parent == null) {
      return undefined as unknown as Child;
    }
    return $parent[key];
  });

  const set = (value: Child) => {
    parent.update(($parent) => {
      if ($parent == null) {
        return undefined as unknown as Parent;
      }
      return {
        ...$parent,
        [key]: value,
      };
    });
  };

  const update = (fn: Updater<Child>) => {
    parent.update(($parent) => {
      if ($parent == null) {
        return undefined as unknown as Parent;
      }
      const newValue = fn($parent[key]);
      return {
        ...$parent,
        [key]: newValue,
      };
    });
  };

  return {
    subscribe: keyedValue.subscribe,
    set,
    update,
  };
}

export function indexed<Element>(
  array: Writable<Element[]>,
  index: number
): Writable<Element | undefined>;
export function indexed<Element>(
  array: Writable<Element[] | undefined | null>,
  index: number
): Writable<Element | undefined>;

export function indexed<Element>(
  array: Writable<Element[] | undefined | null>,
  index: number
): Writable<Element | undefined> {
  const keyedValue = derived(array, ($array) => {
    if ($array == null) {
      return undefined as unknown as Element;
    }
    return $array[index];
  });

  const set = (value: Element) => {
    array.update(($array) => {
      if ($array == null) {
        return undefined as unknown as Element[];
      }
      return [...$array.slice(0, index), value, ...$array.slice(index + 1)];
    });
  };

  const update = (fn: Updater<Element>) => {
    array.update(($array) => {
      if ($array == null) {
        return undefined as unknown as Element[];
      }
      const newValue = fn($array[index]);
      return [...$array.slice(0, index), newValue, ...$array.slice(index + 1)];
    });
  };

  return {
    subscribe: keyedValue.subscribe,
    set,
    update,
  };
}
