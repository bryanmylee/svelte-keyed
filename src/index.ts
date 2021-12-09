import { derived } from "svelte/store";
import type { Readable, Updater, Writable } from "svelte/store";

export const keyed = <Parent>(
  parent: Writable<Parent>,
  key: keyof Parent
): Writable<Parent[keyof Parent]> => {
  type Child = Parent[keyof Parent];

  const keyedValue = derived<Readable<Parent>, Child>(parent, ($parent) => {
    if ($parent === undefined) {
      return undefined as unknown as Child;
    }
    return $parent[key];
  });

  const set = (value: Child) => {
    parent.update(($parent) => {
      if ($parent === undefined) {
        return $parent;
      }
      return {
        ...$parent,
        [key]: value,
      };
    });
  };

  const update = (fn: Updater<Child>) => {
    parent.update(($parent) => {
      if ($parent === undefined) {
        return $parent;
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
};

export const indexed = <Element>(
  array: Writable<Element[]>,
  index: number
): Writable<Element | undefined> => {
  const keyedValue = derived(array, ($array) => {
    if ($array === undefined) {
      return undefined as unknown as Element;
    }
    return $array[index];
  });

  const set = (value: Element) => {
    array.update(($array) => {
      if ($array === undefined) {
        return $array;
      }
      return [...$array.slice(0, index), value, ...$array.slice(index + 1)];
    });
  };

  const update = (fn: Updater<Element>) => {
    array.update(($array) => {
      if ($array === undefined) {
        return $array;
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
};
