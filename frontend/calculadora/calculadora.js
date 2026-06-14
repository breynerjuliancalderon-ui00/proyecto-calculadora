const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const pantalla          = document.getElementById('pantalla');
const expresionDisplay  = document.getElementById('expresion');
const botones           = document.querySelectorAll('.btn');
const historialBtn      = document.getElementById('historial_cal');
const panelHistorial    = document.getElementById('panel-historial');
const tablaHistorial    = document.getElementById('tabla-historial');
const sinHistorial      = document.getElementById('sin-historial');

// Estado
let operacionActual = '';
let memoriaAns      = 0;

// Verificar sesión
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuarioGuardado) {
    window.location.href = '../index.html';
}
const usuarioId = usuarioGuardado.id;

// =====================================================
// LÓGICA DE BOTONES
// =====================================================
botones.forEach(boton => {
    boton.addEventListener('click', () => {
        const control = boton.dataset.control;
        const valor   = boton.dataset.valor;
        const funcion = boton.dataset.funcion;

        if (control === 'clear') {
            operacionActual = '';
            actualizarPantalla('');
            expresionDisplay.textContent = '';
            return;
        }

        if (control === 'delete') {
            operacionActual = operacionActual.slice(0, -1);
            actualizarPantalla(operacionActual);
            return;
        }

        if (funcion === 'ans') {
            operacionActual += memoriaAns;
            actualizarPantalla(operacionActual);
            return;
        }

        if (control === 'igual') {
            calcular();
            return;
        }

        // Funciones científicas que se aplican al valor actual en pantalla
        if (funcion && funcion !== 'ans') {
            aplicarFuncion(funcion);
            return;
        }

        // Números y operadores normales
        if (valor !== undefined) {
            operacionActual += valor;
            actualizarPantalla(operacionActual);
        }
    });
});

function actualizarPantalla(texto) {
    pantalla.value = texto || '0';
    pantalla.classList.remove('error');
}

function calcular() {
    if (!operacionActual) return;

    try {
        const operacionTexto = operacionActual;

        // Reemplazamos símbolos visuales por los que eval() entiende
        let expresion = operacionActual
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        // eslint-disable-next-line no-eval
        let resultado = eval(expresion);

        if (!isFinite(resultado)) throw new Error('División por cero');

        if (resultado % 1 !== 0) {
            resultado = Number(resultado.toFixed(8));
        }

        expresionDisplay.textContent = operacionTexto + ' =';
        pantalla.value = resultado;
        memoriaAns     = resultado;
        operacionActual = resultado.toString();

        guardarEnBD(operacionTexto, resultado);

    } catch (e) {
        pantalla.classList.add('error');
        pantalla.value = 'Error';
        setTimeout(() => {
            operacionActual = '';
            actualizarPantalla('');
            expresionDisplay.textContent = '';
        }, 1500);
    }
}

function aplicarFuncion(funcion) {
    const valorActual = parseFloat(pantalla.value);
    if (isNaN(valorActual)) return;

    let resultado;
    let expresionTexto;

    switch (funcion) {
        case 'sin':
            resultado      = Math.sin(valorActual * Math.PI / 180);
            expresionTexto = `sin(${valorActual}°)`;
            break;
        case 'cos':
            resultado      = Math.cos(valorActual * Math.PI / 180);
            expresionTexto = `cos(${valorActual}°)`;
            break;
        case 'tan':
            resultado      = Math.tan(valorActual * Math.PI / 180);
            expresionTexto = `tan(${valorActual}°)`;
            break;
        case 'log':
            resultado      = Math.log10(valorActual);
            expresionTexto = `log(${valorActual})`;
            break;
        case 'ln':
            resultado      = Math.log(valorActual);
            expresionTexto = `ln(${valorActual})`;
            break;
        case 'raiz':
            resultado      = Math.sqrt(valorActual);
            expresionTexto = `√(${valorActual})`;
            break;
        default:
            return;
    }

    resultado = Number(resultado.toFixed(8));
    expresionDisplay.textContent = expresionTexto + ' =';
    pantalla.value  = resultado;
    memoriaAns      = resultado;
    operacionActual = resultado.toString();

    guardarEnBD(expresionTexto, resultado);
}

// =====================================================
// GUARDAR EN BASE DE DATOS
// =====================================================
function guardarEnBD(operacion, resultado) {
    fetch(`${API_URL}/historial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, operacion, resultado })
    })
    .then(r => r.json())
    .then(data => {
        console.log('Guardado en BD:', data.mensaje);
        // Si el panel está abierto, recargar para mostrar la nueva fila
        if (panelHistorial.style.display === 'block') {
            cargarHistorial();
        }
    })
    .catch(err => console.error('Error al guardar:', err));
}

// =====================================================
// BOTÓN HISTORIAL — mostrar / ocultar
// =====================================================
historialBtn.addEventListener('click', () => {
    if (panelHistorial.style.display === 'block') {
        panelHistorial.style.display = 'none';
    } else {
        panelHistorial.style.display = 'block';
        cargarHistorial();
    }
});

// =====================================================
// CARGAR HISTORIAL DESDE EL SERVIDOR
// =====================================================
function cargarHistorial() {
    const tbody = tablaHistorial.querySelector('tbody');
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#505070;">Cargando...</td></tr>';
    sinHistorial.style.display = 'none';

    fetch(`${API_URL}/historial/${usuarioId}`)
        .then(r => r.json())
        .then(datos => {
            tbody.innerHTML = '';

            if (!datos.length) {
                sinHistorial.style.display = 'block';
                return;
            }

            datos.forEach(fila => {
                const tr = tbody.insertRow();
                tr.insertCell(0).textContent = fila.operacion;
                tr.insertCell(1).textContent = fila.resultado;

                // Formatear fecha legible
                const fecha = new Date(fila.fecha);
                tr.insertCell(2).textContent =
                    fecha.toLocaleDateString('es-CO') + ' ' +
                    fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
            });
        })
        .catch(err => {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#ff4466;">Error al cargar</td></tr>';
            console.error('Error al cargar historial:', err);
        });
}
