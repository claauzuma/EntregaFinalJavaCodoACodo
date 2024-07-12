// Definición de funciones fuera de DOMContentLoaded
document.addEventListener('DOMContentLoaded', cargarUsuarios);
// -- Crear modal -- /

let modificarModal;
let crearModal;

document.addEventListener('DOMContentLoaded', function() {
    modificarModal = new bootstrap.Modal(document.getElementById('modificarModal'));
    crearModal = new bootstrap.Modal(document.getElementById('crearModal'));
    cargarUsuarios();

    const params = new URLSearchParams(window.location.search);
    const nombre = params.get('nombre');

    if (nombre) {
        document.getElementById('bienvenida').textContent = 'Bienvenido, ' + nombre;
    }

    document.getElementById('cerrar-sesion').addEventListener('click', function(event) {
        event.preventDefault();
        cerrarSesion();
    });
});

function cerrarSesion() {
    logeado = false;
    alert('Sesión cerrada');
    window.location.href = './index.html';
}
function cargarUsuarios() {
    fetch('http://localhost:8080/proyectoJava_24112/GestionUsuariosServlet')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('usuarios-tbody');
            tbody.innerHTML = '';
            console.log(data);

            data.forEach(usuario => {
                const row = document.createElement('tr');
                const fechaISO = new Date(usuario.fechaNacimiento).toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.email}</td>
                    <td>********</td>
                    <td>${fechaISO}</td> <!-- Mostrar fecha en formato ISOstring -->
                    <td>${usuario.tipoUsuario}</td>
                    <td>
                        <button class="btn btn-primary btn-sm btn-modificar" data-id="${usuario.id}">Modificar</button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${usuario.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Asignar eventos a los botones dentro de la tabla
            tbody.querySelectorAll('.btn-modificar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    mostrarModificarModal(id);
                });
            });

            tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    eliminarUsuario(id);
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
        });
}

function mostrarModificarModal(id) {
    fetch(`http://localhost:8080/proyectoJava_24112/GestionUsuariosServlet?id=${id}`)
        .then(response => response.json())
        .then(usuario => {
            document.getElementById('userId').value = usuario.id;
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('email').value = usuario.email;
            document.getElementById('password').value = usuario.password;
            document.getElementById('fechaNacimiento').value = new Date(usuario.fechaNacimiento).toISOString().split('T')[0];
            document.getElementById('tipoUsuario').value = usuario.tipoUsuario;
            modificarModal.show();
        })
        .catch(error => console.error('Error al obtener el usuario:', error));
}

function eliminarUsuario(id) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        fetch(`http://localhost:8080/proyectoJava_24112/GestionUsuariosServlet?id=${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    cargarUsuarios();
                } else {
                    alert('Error al eliminar el usuario');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function mostrarCrearModal() {
    crearModal.show();
}

function guardarRegistro() {
    const usuario = {
        nombre: document.getElementById('nombre2').value,
        apellido: document.getElementById('apellido2').value,
        email: document.getElementById('email2').value,
        password: document.getElementById('password2').value,
        fechaNacimiento: document.getElementById('fechaNacimiento2').value,
        tipoUsuario: document.getElementById('tipoUsuario2').value
    };

    fetch('http://localhost:8080/proyectoJava_24112/GestionUsuariosServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            crearModal.hide();
            cargarUsuarios();
        } else {
            alert('Error al crear el usuario');
        }
    })
    .catch(error => console.error('Error:', error));
}

function guardarModificacion() {
    const usuario = {
        id: document.getElementById('userId').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        tipoUsuario: document.getElementById('tipoUsuario').value
    };

    fetch('http://localhost:8080/proyectoJava_24112/GestionUsuariosServlet', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            modificarModal.hide();
            cargarUsuarios();
        } else {
            alert('Error al modificar el usuario');
        }
    })
    .catch(error => console.error('Error:', error));
}
