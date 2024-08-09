const socket = io()
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre para continuar'
    },
    allowOutsideClick:false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user)
})

socket.on('newUserConnected', (newUser) => {
    if (newUser) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: `${newUser} se ha unido al chat`,
            icon: 'success'
        })
    }
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter"){
        if (chatBox.value.trim().length > 0){
            socket.emit("message",{user:user,message:chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message}</br>`
    });
    log.innerHTML = messages;
})

