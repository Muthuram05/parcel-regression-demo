export const products = [
  { id: 'notebook', name: 'Everyday notebook', price: 500 },
  { id: 'pens', name: 'Studio pen set', price: 450 },
  { id: 'deskpad', name: 'Weekly desk pad', price: 1000 },
];

export function quote({ productId = 'notebook', quantity = 1, promoCode = '' } = {}) {
  const product = products.find(item => item.id === productId);
  if (!product) throw new Error('Choose an available product.');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
    throw new Error('Quantity must be a whole number between 1 and 10.');
  if (typeof promoCode !== 'string' || promoCode.length > 40)
    throw new Error('Enter a promotion code of 40 characters or fewer.');
  const normalizedCode = promoCode.toUpperCase();
  const promoApplied = normalizedCode === 'SAVE10';
  if (normalizedCode && !promoApplied) throw new Error('Promotion code is not valid.');
  const subtotal = product.price * quantity;
  const discount = promoApplied ? Math.round(subtotal * 0.10) : 0;
  const shipping = subtotal - discount > 1000 ? 0 : 50;
  return { product: product.name, quantity, subtotal, discount, shipping,
    total: subtotal - discount + shipping, promoApplied };
}
