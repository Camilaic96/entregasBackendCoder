const deleteInactiveUsersBtn = document.getElementById(
	'deleteInactiveUsersBtn'
);
deleteInactiveUsersBtn.addEventListener('click', () => {
	const url = '/api/users/inactive';
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
