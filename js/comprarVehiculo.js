
var vehiculos = [];

const obtenerVehiculos = () => {
  const url = 'http://localhost:5140/api/Vehiculo';

  fetch(url)
  .then(response => {
      if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
      }
      return response.json();
  })
  .then(data => {
      // Aquí data contendrá la lista de objetos de vehículos
      // Puedes hacer lo que necesites con esta lista
      console.log(data);
      vehiculos = data;
   
      
      agregarTarjetasVehiculos();
      
      // O guardar los vehículos en una variable global o en el estado de tu aplicación
      // Para usarlos más adelante en tu código
      // this.listaVehiculos = listaVehiculos; // (si estás en un contexto de clase)
      // O puedes devolver la lista de vehículos y manejarla en otra parte de tu código
      // return listaVehiculos;
  })
  .catch(error => console.error("No se pudieron obtener los vehículos", error));
};



obtenerVehiculos();





var carrito = [];


// Función para crear una tarjeta de vehículo
function crearTarjetaVehiculo(vehiculo) {
  console.log(vehiculo);
  var card = document.createElement("div");
  card.classList.add("cardVehiculo");

  // Agregamos el ID oculto como un atributo data
  card.dataset.id = vehiculo.id;

  var imagen = document.createElement("img");
  imagen.src = vehiculo.imagen;
  imagen.alt = vehiculo.marca;
  imagen.style.width = "200px";
  card.appendChild(imagen);

  var titulo = document.createElement("h3");
  titulo.textContent = vehiculo.marca;
  card.appendChild(titulo);

  var modelo = document.createElement("p");
  modelo.textContent = vehiculo.modelo;
  card.appendChild(modelo);

  var precio = document.createElement("h4");
  precio.textContent = '$ '+vehiculo.precio;
  card.appendChild(precio);

  var boton = document.createElement("button");
  boton.textContent = "Agregar a Carrito";

  // Agregamos un evento de clic al botón para imprimir los datos de la tarjeta
  boton.addEventListener("click", function() {
      agregarVehiculoACarrito(vehiculo);
  });

  card.appendChild(boton);

  return card;
}


// Función para actualizar el contador de productos en el carrito
function actualizarContadorCarrito() {
  var contadorSpan = document.getElementById("contadorCarrito");
  contadorSpan.textContent = carrito.length.toString();
}


// Función para imprimir los datos de la tarjeta
function agregarVehiculoACarrito(vehiculo) {
  carrito.push(vehiculo);
  console.log(carrito);
  actualizarContadorCarrito();
}


// Función para agregar todas las tarjetas de vehículos al contenedor
function agregarTarjetasVehiculos() {
  var container = document.getElementById("containerComprarVehiculo");
  vehiculos.forEach(function(vehiculo) {
      var card = crearTarjetaVehiculo(vehiculo);
      container.appendChild(card);
  });
}

// Llama a la función para agregar las tarjetas de vehículos al cargar la página

//agregarTarjetasVehiculos();




//calcularPrecioTotal
const calcularPrecioTotal = () => {

 

  var precioTotal = 0;

  for (let i = 0; i < carrito.length; i++) {
     
    precioTotal =  precioTotal + carrito[i].precio;
  
  }


  return precioTotal;

};




// carga Detalles De Compra en el modela del carrito
const  cargarDetallesDeCompra = (precioTotal, descuento, totalDeLaOrden) => {
  // Obtener los elementos HTML para los detalles de la compra
  const precioTotalElement = document.getElementById("precioTotal");
  const descuentoElement = document.getElementById("descuento");
  const totalDeLaOrdenElement = document.getElementById("totalDeLaOrden");

  // Asignar los valores recibidos a los elementos HTML
  precioTotalElement.textContent = "$"+ precioTotal;
  descuentoElement.textContent = "$"+  descuento;
  totalDeLaOrdenElement.textContent = "$"+  totalDeLaOrden;
};


// Obtener el botón del carrito por su ID
var carritoBtn = document.getElementById("carritoBtn");

// Agregar un event listener para el evento 'click'
carritoBtn.addEventListener("click", function() {
  
  cargarProductosEnCarrito();


    const precioTotal = calcularPrecioTotal(); 

    const descuento = 0;

    const totalDeLaOrden =  precioTotal - descuento;

    // Llamar a la función para cargar los detalles de la compra
    cargarDetallesDeCompra(precioTotal, descuento, totalDeLaOrden);

});





const cargarProductosEnCarrito = () => {

  // Obtener el contenedor del carrito
  var carritoConteiner = document.getElementById("carritoConteiner");

  // Limpiar el contenedor eliminando todos sus hijos
  carritoConteiner.innerHTML = "";

  // Iterar sobre la lista de vehículos
  carrito.forEach(function(vehiculo) {
      // Crear un div para la tarjeta del vehículo
      var card = document.createElement("div");
      card.classList.add("cardVehiculo");

      // Agregamos el ID oculto como un atributo data
      card.dataset.id = vehiculo.id;

      // Crear la imagen del vehículo
      var imagen = document.createElement("img");
      imagen.src = vehiculo.imagen;
      imagen.alt = vehiculo.marca;
      imagen.style.width = "300px";
      card.appendChild(imagen);

      // Crear el título del vehículo
      var titulo = document.createElement("h3");
      titulo.textContent = vehiculo.marca;
      card.appendChild(titulo);

      // Crear la descripción del vehículo
      var modelo = document.createElement("p");
      modelo.textContent = vehiculo.modelo;
      card.appendChild(modelo);

      // Crear el precio del vehículo
      var precio = document.createElement("h4");
      precio.textContent = '$ '+vehiculo.precio;
      card.appendChild(precio);

      // Agregar la tarjeta del vehículo al contenedor del carrito
      carritoConteiner.appendChild(card);
  });


};



const limpiarProductosEnCarrito = () => {

  console.log("limpio carrito");

  carrito = [];
   // Obtener el contenedor del carrito
   const carritoConteiner = document.getElementById("carritoConteiner");

   // Borrar todos los elementos hijos del contenedor del carrito
   carritoConteiner.innerHTML = '';

   var contadorSpan = document.getElementById("contadorCarrito");
   contadorSpan.textContent = "0";

    // Llamar a la función para cargar los detalles de la compra
    cargarDetallesDeCompra(0, 0, 0);
};



// Obtener el botón "Limpiar Carrito" por su ID
var limpiarCarritoBtn = document.getElementById("limpiarCarrito");

// Agregar un event listener para el evento 'click'
limpiarCarritoBtn.addEventListener("click", function() {
  limpiarProductosEnCarrito();
});


