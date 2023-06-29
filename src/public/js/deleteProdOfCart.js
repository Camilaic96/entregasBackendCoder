let counter = 0;
const idCartElement = document.getElementById('cid');
const cid = idCartElement.textContent;
// Get all product elements
const productElements = document.querySelectorAll('[id^="product-"]');
const objC = [];

// Iterate over each product element
productElements.forEach(productElement => {
	const idProductElement = productElement.querySelector('[id^="pid"]');
	const pid = idProductElement.textContent;

	const quantityContainer = productElement.querySelector(`#quantity-${pid}`);
	counter = parseInt(quantityContainer.textContent);

	objC.push({ pid, counter, lastQuantity: counter });

	const incrementBtn = productElement.querySelector(`#incrementBtn-${pid}`);
	incrementBtn.addEventListener('click', () => {
		objC.forEach(function (ob) {
			if (ob.pid === pid) {
				ob.counter++;
			}
		});
		updateQuantity();
	});

	const decrementBtn = productElement.querySelector(`#decrementBtn-${pid}`);
	decrementBtn.addEventListener('click', () => {
		objC.forEach(function (ob) {
			if (ob.pid === pid) {
				if (ob.counter > 0) {
					ob.counter--;
				}
			}
		});
		updateQuantity();
	});

	const checkQuantityBtn = productElement.querySelector(
		`#checkQuantityBtn-${pid}`
	);
	checkQuantityBtn.addEventListener('click', () => {
		const quantityContainer = productElement.querySelector(`#quantity-${pid}`);
		let quantity = parseInt(quantityContainer.textContent);
		objC.forEach(function (ob) {
			if (ob.pid === pid) {
				quantity -= ob.lastQuantity;
			}
		});
		const obj = {
			_id: pid,
			quantity,
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

	function updateQuantity() {
		objC.forEach(function (ob) {
			if (ob.pid === pid) {
				quantityContainer.textContent = ob.counter;
			}
		});
	}

	const deleteProdOfCartBtn = productElement.querySelector(
		`#deleteProdOfCartBtn-${pid}`
	);
	deleteProdOfCartBtn.addEventListener('click', () => {
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
});
