import test from "node:test";
import assert from "node:assert/strict";
import { quote } from "../src/checkout/pricing.mjs";
test("gift wrapping is optional and off by default", () =>
  assert.equal(quote().giftWrapping, 0));
test("gift wrapping adds ₹75 once per order", () => {
  const order = quote({ quantity: 2, giftWrap: true });
  assert.equal(order.giftWrapping, 75);
  assert.equal(order.total, 1125);
});
test("removing gift wrapping restores the original total", () =>
  assert.equal(quote({ giftWrap: false }).total, 550));
test("promotion does not discount the wrapping fee", () =>
  assert.equal(quote({ giftWrap: true, promoCode: "SAVE10" }).total, 575));
test("invalid wrapping choices are rejected", () =>
  assert.throws(() => quote({ giftWrap: "yes" }), /valid gift wrapping/));
