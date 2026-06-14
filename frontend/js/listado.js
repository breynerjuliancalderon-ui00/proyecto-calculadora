const API_URL = 'http://localhost:3000/api';

fetch(API_URL + '/usuarios')
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        var contenedor = document.getElementById('listaUsuarios');
        var usuarios = datos.usuarios;

        for (var i = 0; i < usuarios.length; i++) {
            contenedor.innerHTML += '<p>' + usuarios[i].nombre + ' - ' + usuarios[i].email + '</p>';
        }
    })
    .catch(function() {
        document.getElementById('mensaje').className = 'mensaje error';
        document.getElementById('mensaje').textContent = 'No se pudo cargar la lista';
    });