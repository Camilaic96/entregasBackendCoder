const form = document.getElementById('forgotPasswordForm');

form.addEventListener('submit', e => {
	e.preventDefault();

	const emailUserElement = document.getElementById('email');
	const emailUser = emailUserElement.textContent;

	const data = new FormData(form);
	const obj = {};

	data.forEach((value, key) => (obj[key] = value));
	obj.email = emailUser;

	const url = '/api/auth/forgotPassword';
	const headers = {
		'Content-Type': 'application/json',
	};
	const method = 'PATCH';
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
