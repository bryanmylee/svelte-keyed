import { derived, Updater, Writable } from "svelte/store";

export const keyed = <Parent>(
  parent: Writable<Parent>,
  key: keyof Parent
): Writable<Parent[keyof Parent]> => {
  type Child = Parent[keyof Parent];

  const keyedValue = derived(parent, ($parent) => $parent[key]);

  const set = (value: Child) => {
    parent.update(($parent) => {
      return {
        ...$parent,
        [key]: value,
      };
    });
  };

  const update = (fn: Updater<Child>) => {
    parent.update(($parent) => {
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
  const keyedValue = derived(array, ($array) => $array[index]);

  const set = (value: Element) => {
    array.update(($array) => {
      return [...$array.slice(0, index), value, ...$array.slice(index + 1)];
    });
  };

  const update = (fn: Updater<Element>) => {
    array.update(($array) => {
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
