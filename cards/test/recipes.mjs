/* node cards/test/recipes.mjs — the cookbook's pure parts. */
import assert from "node:assert/strict";
import { filterRecipes, formData, parseLines } from "../src/hubbubb-recipes.js";

assert.deepEqual(parseLines("- 2 eggs\n\n1. flour \n• salt\n"), ["2 eggs", "flour", "salt"]);
assert.deepEqual(parseLines(""), []);

const rs = [
  { id: 2, title: "Pancakes", ingredients: ["flour", "eggs"], steps: [] },
  { id: 1, title: "Chicken parm", ingredients: ["chicken", "mozzarella"], steps: [] },
];
assert.deepEqual(filterRecipes(rs, "").map((r) => r.id), [1, 2]);
assert.deepEqual(filterRecipes(rs, "EGG").map((r) => r.id), [2]);
assert.deepEqual(filterRecipes(rs, "parm").map((r) => r.id), [1]);
assert.deepEqual(filterRecipes(rs, "tofu"), []);

assert.deepEqual(formData({ id: null, title: " Toast ", ingredients: "bread", steps: "toast it", source: "" }), {
  title: "Toast",
  ingredients: ["bread"],
  steps: ["toast it"],
  source: "",
});
assert.equal(formData({ id: 7, title: "x", ingredients: "", steps: "", source: " u " }).id, 7);
console.log("recipes ok");
