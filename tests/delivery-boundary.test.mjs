import test from "node:test";
import assert from "node:assert/strict";
import { quote } from "../src/checkout/pricing.mjs";
test("exactly ₹1,000 qualifies for free delivery", () => {
  assert.equal(quote({ quantity: 2 }).shipping, 0);
  assert.equal(quote({ quantity: 2 }).total, 1000);
});
test("discounted orders below the threshold still pay delivery", () => {
  assert.equal(quote({ quantity: 2, promoCode: "SAVE10" }).shipping, 50);
});
