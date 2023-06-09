/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chai = require('chai');
const supertest = require('supertest');
const { port } = require('../src/config');

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe('Testing Ecommerce Backend Coder', () => {
	describe('Test de products', () => {
		const mockProduct = {
			title: 'title mockProduct',
			description: 'description mockProduct',
			code: 'code mockProduct',
			price: 1500,
			status: true,
			stock: 5,
			category: 'cat mockProduct',
			thumbnail: [],
			owner: 'admin',
		};

		it('El endpoint GET /api/products debe devolver el status code y un payload con todos los productos. Además, payload debe ser de tipo arreglo', async () => {
			const { _body } = await requester.get('/api/products');

			expect(_body).to.have.property('status');
			expect(_body).to.have.property('payload');
			expect(_body.payload).to.be.an('array');
		});

		it('El endpoint POST /api/products debe crear un producto correctamente', async () => {
			const { _body } = await requester.post('/api/products').send(mockProduct);

			expect(_body).to.have.property('payload');
			expect(_body.payload).to.have.property('_id');
			expect(_body).to.have.property('status');
			expect(_body.status).is.equal(201);
		});

		it('El endpoint GET /api/products/:pid debe devolver el status code y un payload con la información del producto especificado', async () => {
			const pid = '63ffb7a665c2d9beffb04dce';
			const { _body } = await requester.get(`/api/products/${pid}`);

			expect(_body).to.have.property('status');
			expect(_body).to.have.property('payload');
			expect(_body.payload).to.have.property('_id');
			expect(_body.status).is.equal(200);
		});

		it('En el endpoint POST /api/products , si se desea crear un producto sin el campo title, el módulo debe responder con un status 400', async () => {
			const mockProduct = {
				description: 'description mockProduct',
				code: 'code mockProduct',
				price: 1500,
				status: true,
				stock: 5,
				category: 'cat mockProduct',
				thumbnail: [],
				owner: 'admin',
			};

			const { _body } = await requester.post('/api/products').send(mockProduct);

			expect(_body).to.have.property('status');
			expect(_body.status).is.equal(400);
		});

		/*
		it('El endpoint PUT /api/products debe poder actualizar correctamente a un producto determinada comparando el valor previo con el nuevo valor de la base de datos', async () => {
		});
		
		it('El endpoint DELETE /api/product', async () => {
		});
		*/
	});
});
