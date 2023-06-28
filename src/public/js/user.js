const deleteUserBtn = document.getElementById('deleteUserBtn');
deleteUserBtn.addEventListener('click', () => {
	const idUserElement = document.getElementById('uid');
	const uid = idUserElement.textContent;

	const url = `/api/users/${uid}`;
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

const changeRoleBtn = document.getElementById('changeRoleBtn');
changeRoleBtn.addEventListener('click', () => {
	const idUserElement = document.getElementById('uid');
	const uid = idUserElement.textContent;

	const inputRoleUser = document.getElementById('role-user');
	const inputRolePremium = document.getElementById('role-premium');
	const inputRoleAdmin = document.getElementById('role-admin');

	const obj = {};

	obj.userRole = inputRoleUser.checked
		? 'USER'
		: inputRolePremium.checked
		? 'PREMIUM'
		: inputRoleAdmin.checked
		? 'ADMIN'
		: undefined;

	const url = `/api/users/${uid}`;
	const headers = {
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify(obj);
	const method = 'PATCH';

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
