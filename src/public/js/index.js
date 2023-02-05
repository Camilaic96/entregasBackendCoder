const socket = io()

const message = document.getElementById('message')

message.innerHTML = ""

socket.on('mostrarProductos', data => {
    console.log("llega a cliente mostrar")
    console.log(data)
    message.innerHTML = ""
    data.map(product => {
        message.innerHTML += `
            <div class="card mb-3 col-3">
                <div class="card-body">
                    <p class="card-text">Id: <b>${product.id}</b></p>
                    <p class="card-text">Title: <b>${product.title}</b></p>
                    <p class="card-text">Description: <b>${product.description}</b></p>
                    <p class="card-text">Code: <b>${product.code}</b></p>
                    <p class="card-text">Price: <b>${product.price}</b></p>
                    <p class="card-text">Stock: <b>${product.stock}</b></p>
                    <p class="card-text">Category: <b>${product.category}</b></p>
                </div>
            </div>
        `
    })
});

socket.on('crearProducto', data => {
    console.log("llega a cliente crear")
    console.log(data)
    message.innerHTML = ""
    data.map(product => {
        message.innerHTML += `
            <div class="card mb-3 col-3">
                <div class="card-body">
                    <p class="card-text">Id: <b>${product.id}</b></p>
                    <p class="card-text">Title: <b>${product.title}</b></p>
                    <p class="card-text">Description: <b>${product.description}</b></p>
                    <p class="card-text">Code: <b>${product.code}</b></p>
                    <p class="card-text">Price: <b>${product.price}</b></p>
                    <p class="card-text">Stock: <b>${product.stock}</b></p>
                    <p class="card-text">Category: <b>${product.category}</b></p>
                </div>
            </div>
        `
    })
});

socket.on('modificarProducto', data => {
    console.log("llega a cliente modificar")
    console.log(data)
    message.innerHTML = ""
    data.map(product => {
        message.innerHTML += `
            <div class="card mb-3 col-3">
                <div class="card-body">
                    <p class="card-text">Id: <b>${product.id}</b></p>
                    <p class="card-text">Title: <b>${product.title}</b></p>
                    <p class="card-text">Description: <b>${product.description}</b></p>
                    <p class="card-text">Code: <b>${product.code}</b></p>
                    <p class="card-text">Price: <b>${product.price}</b></p>
                    <p class="card-text">Stock: <b>${product.stock}</b></p>
                    <p class="card-text">Category: <b>${product.category}</b></p>
                </div>
            </div>
        `
    })
});

socket.on('eliminarProducto', data => {
    console.log("llega a cliente eliminar")
    console.log(data)
    message.innerHTML = ""
    data.map(product => {
        message.innerHTML += `
            <div class="card mb-3 col-3">
                <div class="card-body">
                    <p class="card-text">Id: <b>${product.id}</b></p>
                    <p class="card-text">Title: <b>${product.title}</b></p>
                    <p class="card-text">Description: <b>${product.description}</b></p>
                    <p class="card-text">Code: <b>${product.code}</b></p>
                    <p class="card-text">Price: <b>${product.price}</b></p>
                    <p class="card-text">Stock: <b>${product.stock}</b></p>
                    <p class="card-text">Category: <b>${product.category}</b></p>
                </div>
            </div>
        `
    })
});