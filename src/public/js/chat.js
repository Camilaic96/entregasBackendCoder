const socket = io()

const swal = async () => {
    const chatBox = document.getElementById("chatBox")
    const result = await Swal.fire({
        title: "Identify yourself",
        input: "text",
        text: "Enter your username to identify yourself in the chat",
        inputValidator: value => {
            return !value && "Enter your username to continue"
        },
        allowOutsideClick: false
    })
    const user = result.value

    socket.emit('newUser', user)

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
        messages += `${message.user}: ${message.message}</br>`
    })
    log.innerHTML = messages
})

socket.on("newClient", user => {
    console.log(user)
})