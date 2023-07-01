let currentSort = 'ASC';
const baseUrl = window.location.href;
if (baseUrl.includes('DESC')) {
	currentSort = 'DESC';
}

const totalPages = 3;

let paginationLinks = '';
for (let page = 1; page <= totalPages; page++) {
	const pageUrl = `/api/products?page=${page}&sort=${currentSort}`;
	paginationLinks += `<li class='page-item'><a class='page-link fs-4' href='${pageUrl}'>${page}</a></li>`;
}

const paginationSection = document.querySelector('.pagination');
paginationSection.innerHTML = paginationLinks;

const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get('page') || 1;

const currentSortLink = document.querySelector(
	`.dropdown-menu a[href*="sort=${urlParams.get('sort')}"]`
);

if (currentSortLink) {
	currentSortLink.classList.add('active');
}

const sortLinks = document.querySelectorAll('.sort a');
sortLinks.forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault();
		const selectedSort = link.getAttribute('href');
		console.log(selectedSort);
		if (selectedSort.includes('DESC')) {
			currentSort = 'DESC';
		} else {
			currentSort = 'ASC';
		}
		const newUrl = `${selectedSort}&page=${currentPage}`;
		window.location.href = newUrl;
	});
});
