const API_URL = 'http://localhost:3000/api';

const formulario = document.getElementById('formRegistro');
const divMensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  // Capturamos los cuatro campos del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const telefono = document.getElementById('telefono').value.trim();
 
  divMensaje.className = 'mensaje';
  divMensaje.textContent = '';

  try {
    const respuesta = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, telefono })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      mostrarMensaje('exito', datos.mensaje + ' Redirigiendo al inicio de sesión...');
      formulario.reset();

      // Tras 2 segundos, lo enviamos al login
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      mostrarMensaje('error', datos.error || 'No se pudo registrar');
    }
  } catch (error) {
    console.error('Error de red:', error);
    mostrarMensaje('error', 'No se pudo conectar con el servidor');
  }
});

function mostrarMensaje(tipo, texto) {
  divMensaje.className = 'mensaje ' + tipo;
  divMensaje.textContent = texto;
}