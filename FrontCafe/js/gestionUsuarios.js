// Obtener el parámetro de la URL
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get('source');
const tipo = urlParams.get('tipo');

// Pasar el parámetro 'source=logeado' a todos los enlaces del nav
if (source) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = new URL(link.href);
        href.searchParams.set('source', 'logeado');
        link.href = href.toString();
    });

    // Ocultar los enlaces de registro y login
    const registroLink = document.getElementById('registroLink');
    const loginLink = document.getElementById('loginLink');
    if (registroLink) registroLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'none';

    
    // Mostrar el enlace de "Cerrar sesión"
    document.getElementById('cerrar-sesion').style.display = 'inline';

    if(tipo === 'usuario') {
    const carritoLink = document.getElementById('carritoLink');
    if(carritoLink) {  carritoLink.style.display ='none'}

    }

}
document.getElementById('cerrar-sesion').addEventListener('click', function(event) {
    event.preventDefault();
    cerrarSesion();
});

// Función para manejar el cierre de sesión
function cerrarSesion() {
    logeado = false;
    alert('Sesión cerrada');
    // Redirigir a la página de inicio o a la página de login
    window.location.href = './index.html';
}