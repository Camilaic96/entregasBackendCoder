const Route = require('../router/router');
const { generateProducts } = require('../utils/mocks/Products.mock');

class MockingProductsRouter extends Route {
	init() {
		this.get('/', ['PUBLIC'], (req, res) => {
			try {
				const products = generateProducts(100);
				console.log(products);
				res.json({ message: products });
				// res.sendSuccess('');
			} catch (error) {
				res.sendServerError(`Something went wrong. ${error}`);
			}
		});
	}
}

const mockingProductsRouter = new MockingProductsRouter();
const mockingProductsController = mockingProductsRouter.getRouter();

module.exports = mockingProductsController;
