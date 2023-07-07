# BackendCoder

## English Version

This project is an e-commerce application developed using Node.js and Handlebars. It allows users to search for products, sort them by price, add them to the shopping cart, and place orders. Additionally, it offers the functionality for users to become premium members, granting them the ability to create, modify, and delete their own products from the database.

The application also includes an administrative module, where administrators have the privilege to create, modify, and delete any product. They can also modify the user roles, delete users, and remove users with more than 2 days of inactivity.

## Features

- User registration
- User login
- Password reset
- Browse products
- Sort products by price
- Product search
- Add products to the shopping cart
- Place orders
- For premium users, the application provides additional features: create, modify, and delete products
- For administrators: create, modify, and delete products, modify user roles, delete users, and remove users with more than two days of inactivity.

## Technologies Used

- Node.js
- Express.js
- Handlebars
- MongoDB
- Mongoose
- Passport
- JSON Web Token (JWT)
- Multer
- Nodemailer
- Socket.io
- Swagger
- Twilio
- Winston
- Faker

## Installation

To run this project locally, follow these steps:

1. Clone this repository: `git clone https://github.com/Camilaic96/entregasBackendCoder`
2. Install dependencies: `npm install`
3. Set up the database connection in the `.env` file
4. Configure the payment gateway with the credentials provided by [payment gateway provider]
5. Start the development server: `npm run start:dev`
6. Open your browser and visit `http://localhost:8080/api` to see the application

## Usage

### As a regular user:

1. Visit the homepage to browse products and register/login as a user.
2. Upload the necessary documentation if you want to become a premium user.
3. Add products to your shopping cart and review the cart contents.
4. Confirm the order and receive an email with the purchase code.

### As a premium user:

1. Visit the homepage to browse products and register/login as a user.
2. Add products to your shopping cart and review the cart contents.
3. Confirm the order and receive an email with the purchase code.
4. Access the Product Administration panel to create, modify, or delete a product that belongs to you.

### As an administrator:

1. Visit the homepage to browse products and register/login as a user.
2. Access the Product Administration panel to create, modify, or delete a product.
3. Access the User Administration panel to modify user roles, delete users, or remove users with more than two days of inactivity.

## Scripts

- `npm test`: Run the tests using Mocha.
- `npm start`: Start the application in development mode.
- `npm run start:local`: Start the application in local mode.
- `npm run start:dev`: Start the application in development mode using Nodemon.
- `npm run start:prod`: Start the application in production mode using Nodemon.
- `npm run format`: Format the code using Prettier.
- `npm run lint`: Lint the code using ESLint.

## Contributing

If you would like to contribute to this project, you can follow these steps:

1. Fork this repository
2. Create a new branch: `git checkout -b my-branch`
3. Make your changes and commit: `git commit -m 'Description of changes'`
4. Push to your forked repository: `git push origin my-branch`
5. Open a Pull Request in this repository

## Contact

If you have any questions or suggestions, feel free to contact me at [camilaicuello@gmail.com]().

###End

## Spanish Version

Este proyecto es una aplicación de comercio electrónico desarrollada con Node.js y Handlebars. Permite a los usuarios buscar productos, ordenarlos por precio, agregarlos al carrito de compras y realizar pedidos. Además, les ofrece la funcionalidad de convertirse en usuarios premium, lo que les permite crear, modificar y eliminar sus propios productos de la base de datos.

La aplicación también incluye un módulo administrativo, donde los administradores tienen el privilegio de crear, modificar y eliminar cualquier producto. También pueden modificar los roles de usuario, eliminar usuarios y eliminar a aquellos que lleven más de 2 días de inactividad.

## Características:

- Registro de usuario
- Inicio de sesión de usuario
- Restablecimiento de contraseña
- Explorar productos
- Ordenar productos por precio
- Búsqueda de productos
- Agregar productos al carrito de compras
- Realizar pedidos
- Para los usuarios premium: crear, modificar y eliminar productos
- Para los administradores: crear, modificar y eliminar productos, modificar el rol de los usuarios, eliminar usuarios y eliminar usuarios con más de dos días de inactividad.

## Tecnologías utilizadas

- Node.js
- Express.js
- Handlebars
- MongoDB
- Mongoose
- Passport
- JSON Web Token (JWT)
- Multer
- Nodemailer
- Socket.io
- Swagger
- Twilio
- Winston
- Faker

## Instalación

Para ejecutar este proyecto localmente, siga estos pasos:

1. Clona este repositorio: `git clone https://github.com/Camilaic96/entregasBackendCoder`
2. Instalar dependencias: `npm install`
3. Configure la conexión de la base de datos en el archivo `.env`
4. Configure la pasarela de pago con las credenciales proporcionadas por [proveedor de pasarela de pago]
5. Inicie el servidor de desarrollo: `npm run start:dev`
6. Abra su navegador y visite `http://localhost:8080/api` para ver la aplicación

## Uso

### Como usuario:

1. Visite la página de inicio para buscar productos y registrarse/iniciar sesión como usuario.
2. Cargue la documentación necesaria si quiere convertirse en usuario premium.
3. Agregue productos a su carrito de compras y revise el contenido del carrito.
4. Confirme el pedido y reciba un correo con el código de compra.

### Como usuario premium:

1. Visite la página de inicio para buscar productos y registrarse/iniciar sesión como usuario.
2. Agregue productos a su carrito de compras y revise el contenido del carrito.
3. Confirme el pedido y reciba un correo con el código de compra.
4. Ingrese al panel de Administración de productos para crear, modificar o eliminar un producto de su autoría.

### Como administrador:

1. Visite la página de inicio para buscar productos y registrarse/iniciar sesión como usuario.
2. Ingrese al panel de Administración de productos para crear, modificar o eliminar un producto.
3. Ingrese al panel de Administración de usuarios para modificar el rol o eliminar a alguno de los usuarios o para eliminar a los usuarios con más de dos días de inactividad.

## Scripts

- `npm test`: Ejecuta las pruebas usando Mocha.
- `npm start`: Inicia la aplicación en modo desarrollo.
- `npm run start:local`: inicia la aplicación en modo local.
- `npm run start:dev`: Inicie la aplicación en modo desarrollo usando Nodemon.
- `npm run start:prod`: Inicie la aplicación en modo producción usando Nodemon.
- `npm run format`: Formatea el código usando Prettier.
- `npm run lint`: Borre el código usando ESLint.

## Contribuyendo

Si quieres contribuir con este proyecto, puedes seguir estos pasos:

1. Bifurcar este repositorio
2. Crea una nueva rama: `git checkout -b my-branch`
3. Realice sus cambios y confirme: `git commit -m 'Descripción de los cambios'`
4. Ingrese a su repositorio bifurcado: `git push origin my-branch`
5. Abra una solicitud de extracción en este repositorio

## Contacto

Si tiene alguna pregunta o sugerencia, no dude en ponerse en contacto conmigo en [camilaicuello@gmail.com]().

###Fin
