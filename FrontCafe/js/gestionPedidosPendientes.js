

// -- Crear modal -- //
let modificarModal;
let agregarModal;

document.addEventListener('DOMContentLoaded', function() {
    modificarModal = new bootstrap.Modal(document.getElementById('modificarModal'));
    agregarModal = new bootstrap.Modal(document.getElementById('agregarModal'));
    cargarPedidosPendientes();
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

function cargarPedidosPendientes() {
    console.log("Cargaremos los pedidos");
    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes')
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
                    <button class="btn btn-success btn-sm" onclick="aprobarPedido2(${pedido.id})">Aprobar</button>
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
    fetch(`http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes?id=${id}`)
        .then(response => response.json())
        .then(pedido => {
            document.getElementById('pedidoId1').value = pedido.id;
            document.getElementById('mesaMod1').value = pedido.numeroDeMesa;
            document.getElementById('nombreMod1').value = pedido.nombre;
            document.getElementById('descripcionMod1').value = pedido.descripcion;
            document.getElementById('precioTotalMod1').value = pedido.precioTotal;
            modificarModal.show();
        })
        .catch(error => console.error('Error al obtener el pedido:', error));
}

function mostrarAgregarModal() {
    console.log("Vamos a crear el pedido");
    agregarModal.show();
       
}


function guardarNuevoPedido() {
    alert("Vamos a guardar el pedido");
    const pedido = {
        id: document.getElementById('pedidoId').value,
        numeroDeMesa: document.getElementById('mesa').value,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precioTotal: document.getElementById('precioTotal').value
    };
    console.log("Vamos a guardar el pedido")
    console.log(pedido);

    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes', {
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
            cargarPedidosPendientes();
        } else {
            alert('Error al crear el pedido');
        }
    })
    .catch(error => console.error('Error:', error));
}

function eliminarPedido(id) {
    console.log("EL ID ES EL " + id);
    console.log("Vamos a intentar eliminar el pedido con ID:", id);
    if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
        fetch(`http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes?id=${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.exito);
                if (data.exito) {
                    console.log("Pedido eliminado exitosamente");
                    cargarPedidosPendientes();
                } else {
                    alert('Error al eliminar el pedido');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function aprobarPedido2(id) {
    console.log("Vamos a aprobar el pedido con ID:", id);
    alert("Pedido aprobado")
    fetch(`http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes?action=aprobar&id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.exito);
        if (data.exito) {
            cargarPedidosPendientes();
        } else {
            alert('Error al aprobar el pedido');
        }
    })
    .catch(error => console.error('Error:', error));
}

function guardarModificacion() {
    const id = document.getElementById('pedidoId1').value;
    const mesa = document.getElementById('mesaMod1').value;
    const nombre = document.getElementById('nombreMod1').value;
    const descripcion = document.getElementById('descripcionMod1').value;
    const preciototal = document.getElementById('precioTotalMod1').value;
    

    const pedidoModificado = {
        id: id,
        numeroDeMesa: mesa,
        nombre: nombre,
        descripcion: descripcion,
        precioTotal: preciototal
    };
    console.log(pedidoModificado);

    fetch('http://localhost:8080/proyectoJava_24112/GestionPedidosPendientes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoModificado)
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido modificado exitosamente');
            modificarModal.hide();
            cargarPedidosPendientes();
        } else {
            alert('Error al modificar el pedido');
        }
    })
    .catch(error => console.error('Error al modificar el pedido:', error));
}





