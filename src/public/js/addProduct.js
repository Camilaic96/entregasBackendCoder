const incrementBtn = document.getElementById('incrementBtn');
incrementBtn.addEventListener('click', incrementQuantity);

const decrementBtn = document.getElementById('decrementBtn');
decrementBtn.addEventListener('click', decrementQuantity);

const addProductBtn = document.getElementById('addProductBtn');
addProductBtn.addEventListener('click', () => {
	const idProductElement = document.getElementById('idProduct');
	const idProduct = idProductElement.textContent;
	const idCartElement = document.getElementById('idCart');
	const idCart = idCartElement.textContent;
	const obj = {
		_id: idProduct,
		quantity: counter,
	};

	const url = `/api/carts/${idCart}/products/${idProduct}`;
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

let counter = 0;

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
