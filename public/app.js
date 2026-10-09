const form = document.querySelector('#checkout-form');
const error = document.querySelector('#error');
const status = document.querySelector('#status');
const currency = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(value);
form.addEventListener('submit', async event => {
  event.preventDefault(); error.textContent = ''; status.textContent = 'Updating your order…';
  const button = form.querySelector('button'); button.disabled = true;
  try {
    const fields = new FormData(form);
    const response = await fetch('/api/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      productId:fields.get('productId'),quantity:Number(fields.get('quantity')),promoCode:fields.get('promoCode'),
    })});
    const data = await response.json();
    if (!response.ok) throw Error(data.error);
    for (const key of ['subtotal','discount','shipping','total']) document.querySelector(`[data-testid="${key}"]`).textContent=currency(data[key]);
    status.textContent = data.promoApplied ? 'SAVE10 applied. Your order is updated.' : 'Your order is updated.';
  } catch (problem) { error.textContent = problem.message || 'Unable to update your order.'; status.textContent = ''; }
  finally { button.disabled = false; }
});
