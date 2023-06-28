const form = document.getElementById('emailResetPasswordForm');

form.addEventListener('submit', e => {
	e.preventDefault();

	const data = new FormData(form);
	const obj = {};

	data.forEach((value, key) => (obj[key] = value));
	console.log(obj);

	const url = '/api/auth/resetPassword';
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
