const bePremiumBtn = document.getElementById('bePremiumBtn');
bePremiumBtn.addEventListener('click', () => {
	const idUserElement = document.getElementById('uid');
	const uid = idUserElement.textContent;

	const url = `/api/users/premium/${uid}`;
	const headers = {
		'Content-Type': 'application/json',
	};
	const method = 'PUT';

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
