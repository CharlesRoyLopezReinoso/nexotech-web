const checkboxes = document.querySelectorAll('.servicio');
const totalcotizacion = document.getElementById('totalcotizacion');

function actualizarTotal() {
    let sumatotal = 0;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            sumatotal += parseFloat(checkboxes[i].value);
        }
    }
    totalcotizacion.textContent = sumatotal.toFixed(2);
}

for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', actualizarTotal);
}



// =========================================
// VALIDACIÓN Y ENVÍO A NETLIFY FORMS
// =========================================
const formulario = document.getElementById('formulario-contacto');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const inputMensaje = document.getElementById('mensaje');
const btnEnviar = document.getElementById('btn-enviar');
const estadoFormulario = document.getElementById('estado-formulario');

// Muestra el aviso rojo y pinta el borde del campo con error
function mostrarError(input, idError, texto) {
    const spanError = document.getElementById(idError);
    spanError.textContent = texto;
    input.classList.add('input-error');
}

// Limpia el aviso rojo y devuelve el campo a su borde normal
function limpiarError(input, idError) {
    const spanError = document.getElementById(idError);
    spanError.textContent = '';
    input.classList.remove('input-error');
}

// Quita el error automáticamente apenas el usuario empieza a escribir
inputNombre.addEventListener('input', function() {
    limpiarError(inputNombre, 'error-nombre');
});

inputEmail.addEventListener('input', function() {
    limpiarError(inputEmail, 'error-email');
});

inputMensaje.addEventListener('input', function() {
    limpiarError(inputMensaje, 'error-mensaje');
});

// Evento al presionar "Enviar Mensaje"
formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página se recargue

    let formularioValido = true;
    estadoFormulario.textContent = '';
    estadoFormulario.className = '';

    // 1. Validar Nombre
    if (inputNombre.value.trim() === '') {
        mostrarError(inputNombre, 'error-nombre', 'Falta completar tu nombre.');
        formularioValido = false;
    } else {
        limpiarError(inputNombre, 'error-nombre');
    }

    // 2. Validar Correo Electrónico
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inputEmail.value.trim() === '') {
        mostrarError(inputEmail, 'error-email', 'Falta ingresar tu correo electrónico.');
        formularioValido = false;
    } else if (!patronEmail.test(inputEmail.value.trim())) {
        mostrarError(inputEmail, 'error-email', 'Ingresa un correo válido (ejemplo@dominio.com).');
        formularioValido = false;
    } else {
        limpiarError(inputEmail, 'error-email');
    }

    // 3. Validar Problema Técnico
    if (inputMensaje.value.trim() === '') {
        mostrarError(inputMensaje, 'error-mensaje', 'Falta describir el problema técnico de tu equipo.');
        formularioValido = false;
    } else {
        limpiarError(inputMensaje, 'error-mensaje');
    }

    // Si falta algún dato, detenemos aquí el envío
    if (!formularioValido) {
        return;
    }

    // 4. Envío real a Netlify Forms (formato URL-encoded obligatorio)
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
        const datosFormulario = new FormData(formulario);

        const respuesta = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(datosFormulario).toString()
        });

        if (respuesta.ok) {
            estadoFormulario.textContent = '¡Mensaje enviado con éxito! Te responderemos pronto.';
            estadoFormulario.className = 'estado-exito';
            formulario.reset();
        } else {
            estadoFormulario.textContent = 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.';
            estadoFormulario.className = 'estado-error';
        }
    } catch (error) {
        estadoFormulario.textContent = 'Error de conexión. Revisa tu internet e intenta nuevamente.';
        estadoFormulario.className = 'estado-error';
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensaje';
    }
});