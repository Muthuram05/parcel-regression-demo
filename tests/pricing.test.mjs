import test from 'node:test';
import assert from 'node:assert/strict';
import {quote} from '../src/checkout/pricing.mjs';

test('a notebook includes standard delivery',()=>assert.equal(quote().total,550));
test('quantity changes item subtotal',()=>assert.equal(quote({productId:'pens',quantity:2}).subtotal,900));
test('orders above the threshold get free delivery',()=>assert.equal(quote({quantity:3}).shipping,0));
test('SAVE10 discounts items by exactly ten percent',()=>{
  const order=quote({quantity:2,promoCode:'SAVE10'});
  assert.equal(order.discount,100);assert.equal(order.total,950);
});
test('promotion matching is case insensitive',()=>assert.equal(quote({promoCode:'save10'}).discount,50));
test('unknown promotions are rejected',()=>assert.throws(()=>quote({promoCode:'INVALID'}),/not valid/));
test('invalid quantities are rejected',()=>{for(const quantity of [0,-1,1.5,11]) assert.throws(()=>quote({quantity}),/Quantity/);});
