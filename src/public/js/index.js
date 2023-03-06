const socket = io()

const messageProduct = document.getElementById('messageProduct')
messageProduct.innerHTML = ""

socket.on('showProducts', (data) => {
    document.getElementById('preLoadProducts').innerHTML = ''

    messageProduct.innerHTML = ""
    let html = data.map((product) => {
        let respond = `
            <div class="card mb-3 col-md-3">
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
        return respond
    })
    messageProduct.innerHTML = html
});