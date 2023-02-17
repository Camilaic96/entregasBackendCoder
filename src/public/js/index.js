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

//crear una funcion mostrarProducto que reciba por parametro el prod para reemplazar el codigo inyectado


//modificaciones sweerAlert

//buscar cómo hacer para bloquear la pantalla hasta que coloque el usuario. Al clickear afuera no se salga el mensaje
const swal = async () => {
    const chatBox = document.getElementById("chatBox")
    const result = await Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa el usuario para identificarte en el chat",
        inputValidator: value => {
            return !value && "Necesitas escribir un nombre de usuario para continuar!"
        },
        allowOutsideClick: false
    })
    const user = result.value

    socket.emit('newUser', user)
    socket.on('userConnected', user => {
        Swal.fire({
            // title: "Bienvenido!",
            text: `Bienvenido ${user} al chat!`,
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            icon: "success",
            background: "#030366",
            color: "#fff"
        })
    })

    chatBox.addEventListener('keyup', e => {
        if (e.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                const message = {
                    user: user,
                    message: chatBox.value
                }
                socket.emit("message", message)
            }
        }
    })
}
swal()

socket.on("messageLogs", data => {
    const log = document.getElementById("messageLogs")
    let messages = ""
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML = messages
})

socket.on("newClient", user => {
    console.log(user)
})