//el localstorage es como un almacen en el navegador donde se puede guardar informacion . es ideal para el carrito
//document. busca elementos ya q representa la pagina de html
// Array para almacenar productos del carrito
let carrito = []

// Cargar carrito desde LocalStorage al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarCarritoDesdeLocalStorage()
    actualizarContador()
    configurarFiltros()

    // Agregar evento click al boton del carrito
    const botonCarrito = document.querySelector('a[href="#carrito"]')
    if(botonCarrito){
        botonCarrito.addEventListener('click', function(e){
            e.preventDefault()
            abrirCarrito()
        })
    }
})

// Funcion para agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.nombre === nombre)

    if(productoExistente){
        productoExistente.cantidad += 1
    } else {
        carrito.push({ //push : metodo que agrega elementos al final de un array
            nombre: nombre,
            precio: precio,
            cantidad: 1
        })
    }

    guardarCarritoEnLocalStorage()
    actualizarContador()
    mostrarNotificacion('Producto agregado al carrito')
}

// Funcion para eliminar producto del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre)
    guardarCarritoEnLocalStorage()
    actualizarContador()
    mostrarCarrito()
}

// Funcion para cambiar cantidad de un producto
function cambiarCantidad(nombre, cantidad) {
    const producto = carrito.find(item => item.nombre === nombre)

    if(producto){
        producto.cantidad = parseInt(cantidad) //parseint convierte un string a un num entero

        if(producto.cantidad <= 0){
            eliminarDelCarrito(nombre)
        } else {
            guardarCarritoEnLocalStorage()
            mostrarCarrito()
        }
    }
}

// Funcion para vaciar todo el carrito
function vaciarCarrito() {
    if(confirm('¿Estás segura de que deseas vaciar el carrito?')){
        carrito = []
        guardarCarritoEnLocalStorage()
        actualizarContador()
        mostrarCarrito()
        mostrarNotificacion('Carrito vaciado')
    }
}

// Guardar carrito en LocalStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// Cargar carrito desde LocalStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito')

    if(carritoGuardado){
        carrito = JSON.parse(carritoGuardado)
    }
}

// Actualizar contador del carrito
function actualizarContador() {
    const contador = document.getElementById('contador-carrito')

    if(contador){
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)
        contador.textContent = totalItems
    }
}

// Abrir modal del carrito
function abrirCarrito() {
    const modal = document.getElementById('carrito-modal')

    if(modal){
        modal.style.display = 'flex'
        mostrarCarrito()
    }
}

// Cerrar modal del carrito
function cerrarCarrito() {
    const modal = document.getElementById('carrito-modal')

    if(modal){
        modal.style.display = 'none'
    }
}

// Mostrar items del carrito en el modal
function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items')
    const carritoTotal = document.getElementById('carrito-total')

    if(!carritoItems || !carritoTotal){
        return
    }

    if(carrito.length === 0){
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>'
        carritoTotal.textContent = '$0'
        return
    }

    let html = ''
    let total = 0

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad
        total += subtotal

        html += `
            <div class="carrito-item">
                <div class="carrito-item-info">
                    <h5>${item.nombre}</h5>
                    <p class="text-muted">$${item.precio.toLocaleString('es-CL')}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', ${item.cantidad - 1})">-</button>
                    <input
                        type="number"
                        value="${item.cantidad}"
                        min="1"
                        onchange="cambiarCantidad('${item.nombre}', this.value)"
                        style="width: 50px; text-align: center;"
                    >
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', ${item.cantidad + 1})">+</button>
                </div>
                <div class="carrito-item-subtotal">
                    <strong>$${subtotal.toLocaleString('es-CL')}</strong>
                </div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.nombre}')" title="Eliminar">🗑️</button>
            </div>
        `
    })

    html += '<button class="btn-vaciar-carrito" onclick="vaciarCarrito()">Vaciar Carrito</button>'

    carritoItems.innerHTML = html
    carritoTotal.textContent = `$${total.toLocaleString('es-CL')}`
}

// Proceder al checkout (simulado)
function procederCheckout() {
    if(carrito.length === 0){
        alert('Tu carrito está vacío')
        return
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

    alert(`Checkout simulado\n\nTotal a pagar: $${total.toLocaleString('es-CL')}\n\nEn una implementación real, aquí se redigiría a la página de pago.`)

    // Vaciar carrito despues del "checkout"
    carrito = []
    guardarCarritoEnLocalStorage()
    actualizarContador()
    cerrarCarrito()
}

// Mostrar notificacion temporal
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div')
    notificacion.className = 'notificacion-carrito'
    notificacion.textContent = mensaje

    document.body.appendChild(notificacion)

    setTimeout(() => {
        notificacion.classList.add('mostrar')
    }, 10)

    setTimeout(() => {
        notificacion.classList.remove('mostrar')
        setTimeout(() => {
            document.body.removeChild(notificacion)
        }, 300)
    }, 2000)
}

// Configurar filtros de categoria
function configurarFiltros() {
    const botonesFiltro = document.querySelectorAll('[data-categoria]')
    const productos = document.querySelectorAll('#productos-grid > div[data-categoria]')

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria')

            // Actualizar botones activos
            botonesFiltro.forEach(btn => btn.classList.remove('active'))
            this.classList.add('active')

            // Filtrar productos
            productos.forEach(producto => {
                const productoCategoria = producto.getAttribute('data-categoria')

                if(categoria === 'todos' || productoCategoria === categoria){
                    producto.style.display = 'block'
                } else {
                    producto.style.display = 'none'
                }
            })
        })
    })
}

// Validacion del formulario de contacto
function validarFormulario(event) {
    event.preventDefault()

    // Obtener elementos del formulario
    const nombre = document.getElementById('nombre')
    const email = document.getElementById('email')
    const asunto = document.getElementById('asunto')
    const mensaje = document.getElementById('mensaje')

    let hayErrores = false

    // Limpiar errores previos
    document.querySelectorAll('.form-text.text-danger').forEach(el => el.textContent = '')

    // Validar nombre (minimo 3 caracteres)
    if(nombre.value.trim().length < 3){
        document.getElementById('error-nombre').textContent = 'El nombre debe tener al menos 3 caracteres'
        hayErrores = true
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email.value)){
        document.getElementById('error-email').textContent = 'Ingresa un email válido'
        hayErrores = true
    }

    // Validar asunto
    if(asunto.value === ''){
        document.getElementById('error-asunto').textContent = 'Selecciona un asunto'
        hayErrores = true
    }

    // Validar mensaje (minimo 10 caracteres)
    if(mensaje.value.trim().length < 10){
        document.getElementById('error-mensaje').textContent = 'El mensaje debe tener al menos 10 caracteres'
        hayErrores = true
    }

    // Si no hay errores, mostrar mensaje de exito
    if(!hayErrores){
        document.getElementById('mensaje-exito').style.display = 'block'

        // Limpiar formulario
        document.getElementById('form-contacto').reset()

        // Ocultar mensaje despues de 5 segundos
        setTimeout(() => {
            document.getElementById('mensaje-exito').style.display = 'none'
        }, 5000)
    }

    return false
}
