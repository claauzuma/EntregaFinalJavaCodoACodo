
let modificarModal;
let agregarModal;

document.addEventListener('DOMContentLoaded', function() {
    modificarModal = new bootstrap.Modal(document.getElementById('modificarModal'));
    agregarModal = new bootstrap.Modal(document.getElementById('agregarModal'));
    cargarPedidos();
});


const params = new URLSearchParams(window.location.search);
const nombre = params.get('nombre');

if (nombre) {
    document.getElementById('bienvenida').textContent = 'Bienvenido, ' + nombre;
}

document.getElementById('cerrar-sesion').addEventListener('click', function(event) {
    event.preventDefault();
    cerrarSesion();
});

function cerrarSesion() {
    alert('Sesión cerrada');
    window.location.href = './index.html';
}

function cargarPedidos() {
    console.log("Vamos a cargar los pedidos papaaa")
    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosServlet')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('pedidos-tbody');
            tbody.innerHTML = ''; // Limpiamos el contenido actual antes de agregar nuevos datos
            data.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${pedido.numeroDeMesa}</td>
                    <td>${pedido.nombre}</td>
                    <td>${pedido.descripcion}</td>
                    <td>${pedido.precioTotal}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="mostrarModificarModal(${pedido.id})">Modificar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener los pedidos:', error);
        });
}



function mostrarModificarModal(id) {
    console.log("Vamos a modificar el pedido con ID:", id);
    
    fetch(`http://localhost:8080/proyectoJava_24112/GestionPedidosServlet?id=${id}`)
        .then(response => response.json())
        .then(pedido => {
            console.log(pedido);
            document.getElementById('pedidoId').value = pedido.id;
            document.getElementById('mesa').value = pedido.numeroDeMesa;
            document.getElementById('nombre').value = pedido.nombre;
            document.getElementById('descripcion').value = pedido.descripcion;
            document.getElementById('precioTotal').value = pedido.precioTotal;

            modificarModal.show();
        })
        .catch(error => console.error('Error al obtener el pedido:', error));
}




function mostrarAgregarModal() {
    console.log("Vamos a crear el pedido daleeeeeeeeeeeeeeeeeeeee");
    agregarModal.show();
       
}


function guardarNuevoPedido() {
    alert("Vamos a guardar el pedido CHEEEEEEEEEEEEEEEE");
    const pedido = {
        id: document.getElementById('pedidoId').value,
        numeroDeMesa: document.getElementById('mesa').value,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precioTotal: document.getElementById('precioTotal').value
    };
    console.log("Vamos a guardar el pedido")
    console.log(pedido);

    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.exito);
        if (data.exito) {
            agregarModal.hide();
            document.getElementById('pedidoId').value = "";
            document.getElementById('mesa').value = "";
            document.getElementById('nombre').value = "";
            document.getElementById('descripcion').value = "";
            document.getElementById('precioTotal').value = "";
            cargarPedidos();
        } else {
            alert('Error al modificar el pedido');
        }
    })
    .catch(error => console.error('Error:', error));
}


function guardarModificacion() {
    console.log("Procedemos a guardar la modificacion")
    const pedido = {

        id: document.getElementById('pedidoId').value,
        numeroDeMesa: document.getElementById('mesa').value,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precioTotal: document.getElementById('precioTotal').value
    };
    console.log(pedido);
    console.log("Le enviamos el pedido al back")

    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosServlet', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.exito);
        if (data.exito) {
            modificarModal.hide();
            cargarPedidos();
        } else {
            alert('Error al modificar el pedido');
        }
    })
    .catch(error => console.error('Error:', error));
}



function eliminarPedido(id) {
    console.log("EL ID ES EL " +id)
    console.log("Vamos a intentar eliminar el pedido con ID:", id);
    if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
        fetch(`http://localhost:8080/proyectoJava_24112/GestionPedidosServlet?id=${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.exito);
                if (data.exito) {
                    console.log("Pedido eliminado exitosamente");
                    cargarPedidos();
                    // location.reload(); // No necesaria si solo se actualiza la tabla
                } else {
                    alert('Error al eliminar el pedido');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}
