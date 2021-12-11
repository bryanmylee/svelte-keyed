import { get, writable } from "svelte/store";
import { getTokens, keyed } from ".";

interface User {
  name: Name;
  email: string;
  age: number;
}

interface Name {
  first: string;
  last: string;
}

describe("get tokens", () => {
  test("object properties", () => {
    const result = getTokens("a.b.c");
    expect(result).toStrictEqual(["a", "b", "c"]);
  });

  test("array indexing", () => {
    const result = getTokens("[3]");
    expect(result).toStrictEqual(["3"]);
  });

  test("consecutive array indexing", () => {
    const result = getTokens("[3][4][6]");
    expect(result).toStrictEqual(["3", "4", "6"]);
  });

  test("mixed", () => {
    const result = getTokens("a[3].b.c[4][5]");
    expect(result).toStrictEqual(["a", "3", "b", "c", "4", "5"]);
  });
});

describe("shallow keyed object test", () => {
  let user: User;
  beforeEach(() => {
    user = {
      email: "john@email.com",
      age: 10,
      name: { first: "john", last: "smith" },
    };
  });

  it("subscribes to the correct value", () => {
    const parent = writable(user);
    const age = keyed(parent, "age");
    const email = keyed(parent, "email");
    expect(get(age)).toBe(10);
    expect(get(email)).toBe("john@email.com");
  });

  it("updates when the parent updates", () => {
    const parent = writable(user);
    const age = keyed(parent, "age");
    parent.update(($parent) => ({
      ...$parent,
      age: 11,
    }));
    expect(get(age)).toBe(11);
  });

  it("updates parent when child is updated", () => {
    const parent = writable(user);
    const age = keyed(parent, "age");
    age.update(($age) => $age + 1);
    expect(get(parent)).toStrictEqual({ ...user, age: 11 });
  });

  it("updates parent when child is set", () => {
    const parent = writable(user);
    const age = keyed(parent, "age");
    age.set(11);
    expect(get(parent)).toStrictEqual({ ...user, age: 11 });
  });

  describe("undefined", () => {
    it("handles undefined subscription", () => {
      const parent = writable<User | undefined>(undefined);
      const age = keyed(parent, "age");
      expect(get(age)).toBeUndefined();
    });

    it("handles undefined parent update", () => {
      const parent = writable<User | undefined>(undefined);
      const age = keyed(parent, "age");
      parent.update(($parent) => $parent);
      expect(get(age)).toBeUndefined();
    });

    it("handles undefined parent child update", () => {
      const parent = writable<User | undefined>(undefined);
      const age = keyed(parent, "age");
      age.update(($age) => ($age !== undefined ? $age + 1 : 0));
      expect(get(parent)).toBeUndefined();
    });

    it("handles undefined parent child set", () => {
      const parent = writable<User | undefined>(undefined);
      const age = keyed(parent, "age");
      age.set(10);
      expect(get(parent)).toBeUndefined();
    });
  });
});

describe("shallow keyed array test", () => {
  let actions: string[];
  beforeEach(() => {
    actions = ["eat", "sleep", "code", "repeat"];
  });

  it("subscribes to the correct value", () => {
    const parent = writable(actions);
    const action = keyed(parent, "[2]");
    expect(get(action)).toBe("code");
  });

  it("updates when the parent updates", () => {
    const parent = writable(actions);
    const action = keyed(parent, "[2]");
    parent.set(["eat", "sleep", "sleep", "repeat"]);
    expect(get(action)).toBe("sleep");
  });

  it("updates parent when child is updated", () => {
    const parent = writable(actions);
    const action = keyed(parent, "[2]");
    action.update(($action) => $action.toUpperCase());
    expect(get(parent)).toStrictEqual(["eat", "sleep", "CODE", "repeat"]);
  });

  it("updates parent when child is set", () => {
    const parent = writable(actions);
    const action = keyed(parent, "[2]");
    action.set("sleep");
    expect(get(parent)).toStrictEqual(["eat", "sleep", "sleep", "repeat"]);
  });

  describe("undefined", () => {
    it("handles undefined subscription", () => {
      const parent = writable<string[] | undefined>(undefined);
      const action = keyed(parent, "[2]");
      expect(get(action)).toBeUndefined();
    });

    it("handles undefined parent update", () => {
      const parent = writable<string[] | undefined>(undefined);
      const action = keyed(parent, "[2]");
      parent.update(($parent) => $parent);
      expect(get(action)).toBeUndefined();
    });

    it("handles undefined parent child update", () => {
      const parent = writable<string[] | undefined>(undefined);
      const action = keyed(parent, "[2]");
      action.update(($action) => $action?.toUpperCase());
      expect(get(parent)).toBeUndefined();
    });

    it("handles undefined parent child set", () => {
      const parent = writable<string[] | undefined>(undefined);
      const action = keyed(parent, "[2]");
      action.set("sleep");
      expect(get(parent)).toBeUndefined();
    });
  });
});
