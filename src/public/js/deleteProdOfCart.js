const deleteProdOfCartBtn = document.getElementById('deleteProdOfCartBtn');
deleteProdOfCartBtn.addEventListener('click', () => {
	const idProductElement = document.getElementById('pid');
	const pid = idProductElement.textContent;
	const idCartElement = document.getElementById('cid');
	const cid = idCartElement.textContent;

	const url = `/api/carts/${cid}/products/${pid}`;
	const headers = {
		'Content-Type': 'application/json',
	};
	const method = 'DELETE';

	fetch(url, {
		headers,
		method,
	})
		.then(response =>
			response.redirected
				? (window.location.href = response.url)
				: response.json()
		)
		.then(data => console.log(data))
		.catch(error => console.log(error));
});

const incrementBtn = document.getElementById('incrementBtn');
incrementBtn.addEventListener('click', incrementQuantity);

const decrementBtn = document.getElementById('decrementBtn');
decrementBtn.addEventListener('click', decrementQuantity);

const checkQuantityBtn = document.getElementById('checkQuantityBtn');
checkQuantityBtn.addEventListener('click', () => {
	const idProductElement = document.getElementById('pid');
	const pid = idProductElement.textContent;
	const idCartElement = document.getElementById('cid');
	const cid = idCartElement.textContent;
	const obj = {
		_id: pid,
		quantity: counter - q,
	};

	const url = `/api/carts/${cid}/products/${pid}`;
	const headers = {
		'Content-Type': 'application/json',
	};
	const method = 'POST';
	const body = JSON.stringify(obj);

	fetch(url, {
		headers,
		method,
		body,
	})
		.then(response =>
			response.redirected
				? (window.location.href = response.url)
				: response.json()
		)
		.then(data => console.log(data))
		.catch(error => console.log(error));
});

const quantityContainer = document.getElementById('quantity');
const q = quantityContainer.textContent;

let counter = q;

function incrementQuantity() {
	counter++;
	updateQuantity();
}

function decrementQuantity() {
	if (counter > 0) {
		counter--;
		updateQuantity();
	}
}

function updateQuantity() {
	const counterElement = document.getElementById('quantity');
	counterElement.textContent = counter.toString();
}
