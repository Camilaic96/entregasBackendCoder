const { faker } = require('@faker-js/faker');

faker.locale = 'es';

const generateProducts = numOfProducts => {
	const products = [];
	for (let i = 0; i < numOfProducts; i++) {
		const product = {
			id: faker.database.mongodbObjectId(),
			title: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			code: faker.datatype.uuid(),
			price: Number(faker.commerce.price()),
			status: faker.datatype.boolean(),
			stock: faker.datatype.number(100),
			category: faker.helpers.arrayElement(['cat1', 'cat2', 'cat3']),
			thumbnail: [
				faker.image.imageUrl(),
				faker.image.imageUrl(),
				faker.image.imageUrl(),
				faker.image.imageUrl(),
				faker.image.imageUrl(),
			],
		};
		products.push(product);
	}
	return products;
};

module.exports = { generateProducts };
