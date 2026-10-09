import test from "node:test";
import assert from "node:assert/strict";
import { quote } from "../src/checkout/pricing.mjs";
test("surrounding whitespace no longer rejects SAVE10", () => {
  assert.equal(quote({ promoCode: "  save10  " }).promoApplied, true);
});
