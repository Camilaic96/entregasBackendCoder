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
		it('El endpoint PUT /api/products debe poder actualizar correctamente a un producto determinada comparando el valor previo con el nuevo valor de la base de datos', async () => {});

		it('El endpoint DELETE /api/product', async () => {});
		*/
	});

	describe('Test de carts', () => {
		it('El endpoint GET /api/carts debe devolver el status code y un payload con todos los carritos. Además, payload debe ser de tipo arreglo', async () => {
			const { _body } = await requester.get('/api/carts');

			expect(_body).to.have.property('status');
			expect(_body).to.have.property('payload');
			expect(_body.payload).to.be.an('array');
		});

		it('El endpoint GET /api/carts/:cid debe devolver el status code y un payload con la información del carrito especificado', async () => {
			const cid = '6400af2b5dddbf4afb235bda';
			const { _body } = await requester.get(`/api/carts/${cid}`);

			expect(_body).to.have.property('status');
			expect(_body).to.have.property('payload');
			expect(_body.payload).to.have.property('_id');
			expect(_body.status).is.equal(200);
		});

		it('El endpoint POST /api/carts debe crear un carrito vacío correctamente', async () => {
			const { _body } = await requester.post('/api/carts').send();

			expect(_body).to.have.property('payload');
			expect(_body.payload).to.have.property('_id');

			expect(_body).to.have.property('status');
			expect(_body.status).is.equal(201);
			expect(_body.payload).to.have.property('products');
			expect(_body.payload.products).to.be.an('array').that.is.empty;
		});
		/*
		it('El endpoint POST /api/carts/:cid/products/:pid ', async () => {});

		it('El endpoint PUT /api/carts/:cid ', async () => {});

		it('El endpoint PUT /api/carts/:cid/products/:pid ', async () => {});

		it('El endpoint DELETE /api/carts/:cid/products/:pid ', async () => {});

		it('El endpoint DELETE /api/carts/:cid ', async () => {});

		it('El endpoint GET /api/carts/:cid/purchase ', async () => {});
	*/
	});

	describe('Test de session', () => {
		const cookie = {};
		it('Debe registrar correctamente a un usuario', async () => {
			const mockUser = {
				first_name: 'Nombre mock test',
				last_name: 'Apellido mock test',
				email: 'mockUser@test.com',
				age: 26,
				password: 'mockUser123',
				carts: [],
				role: 'admin',
				documents: [],
				last_connection: {
					date: Date.now(),
				},
			};

			const { _body } = await requester.post('/api/users').send(mockUser);

			expect(_body.payload).to.be.ok;
			expect(_body.status).is.equal(201);
		});

		it('Debe logear correctamente al usuario y devolver una cookie', async () => {
			const mockUser = {
				email: 'mockUser@test.com',
				password: 'mockUser123',
			};

			const { headers } = await requester.post('/api/auth').send(mockUser);

			const cookieResult = headers['set-cookie'][0];
			expect(cookieResult).to.be.ok;

			cookie.name = cookieResult.split('=')[0];
			cookie.value = cookieResult.split('=')[1];

			expect(cookie.name).to.be.ok.and.equal('connect.sid');
			expect(cookie.value).to.be.ok;
		});

		it('Debe enviar la cookie que contiene el usuario y destructurarlo correctamente', async () => {
			const { _body } = await requester
				.get('/api/session/current')
				.set('Cookie', [`${cookie.name}=${cookie.value}`]);

			expect(_body.payload.email).to.be.equal('mockUser@test.com');
		});
	});
});
