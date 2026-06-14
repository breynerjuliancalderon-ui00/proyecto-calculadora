// URL del backend (puerto donde corre Node.js)
const API_URL = 'http://localhost:3000/api';

// Seleccionamos el formulario y el div de mensajes
const formulario = document.getElementById('formLogin');
const divMensaje = document.getElementById('mensaje');

// Escuchamos el evento "submit" del formulario
formulario.addEventListener('submit', async (evento) => {

    // 1. Evitamos que el formulario recargue la página
    evento.preventDefault();

    // 2. Recogemos los valores ingresados por el usuario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // 3. Limpiamos cualquier mensaje previo
    divMensaje.className = 'mensaje';
    divMensaje.textContent = '';

    try {
        // 4. Enviamos la petición POST al backend con fetch
        const respuesta = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // 5. Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // 6. Manejamos según el estado HTTP
        if (respuesta.ok) {
            mostrarMensaje('exito', datos.mensaje);
            // Guardamos los datos del usuario en sessionStorage
            sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));
            // Redirigimos a bienvenida tras 1 segundo
            setTimeout(() => {
                window.location.href = 'bienvenida.html';
            }, 1000);
        } else {
            mostrarMensaje('error', datos.error || 'Error desconocido');
        }

    } catch (error) {
        console.error('Error de red:', error);
        mostrarMensaje('error', 'No se pudo conectar con el servidor');
    }
});

// Función auxiliar para mostrar mensajes en pantalla
function mostrarMensaje(tipo, texto) {
    divMensaje.className = 'mensaje ' + tipo;
    divMensaje.textContent = texto;
}