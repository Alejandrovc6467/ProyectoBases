

const cargarCorreoEnEtiqueta = () => {


    // Leer el objeto desde sessionStorage
    const storedUser = sessionStorage.getItem("sesionUser");
  
    // Verificar que el objeto no sea null
    if (storedUser) {
        // Parsear el JSON a un objeto JavaScript
        const sesionUser = JSON.parse(storedUser);
  
        // Acceder a la propiedad cedula
        const cedula = sesionUser.cedula;
  
        const bienvenidaElement = document.getElementById("bienvenida_nameUser");
      bienvenidaElement.textContent = cedula;
  
        // Mostrar la cedula en la consola
        console.log("Cédula recuperada:", cedula);
    } else {
        console.log("No se encontró ninguna sesión guardada en sessionStorage.");
    }
  
    
  };
  
  cargarCorreoEnEtiqueta();


// cargar tabla profesores
var tableProfesores = null;
$(document).ready(function () {
    $('#myTable thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#myTable thead');

        
    tableProfesores = $('#myTable').DataTable({

        "ajax": {
            "url": "https://agenciavehiculos.azurewebsites.net/api/Repuesto",
            "dataSrc": ""
        },

        "columns": [
            { "data": "idRespuesto" },
            { "data": "nombreCategoria" },
            { "data": "nombre" },
            { "data": "descripcion" },
            { "data": "precio" },
            { "data": "stock" }
        ],

        "columnDefs": [
            {
                "targets": 6,
                "sortable": false,
                "render": function (data, type, full, meta) {
                    return "<center>" +
                        "<button type='button' class='butonEditDelete' data-bs-toggle='modal' data-bs-target='#modalActualizarPieza' id='cargarDatosAmodalActualizar'> " +
                        "<i class='fa-solid fa-pen-to-square fa-lg' style='color: #6198ff'></i> " +
                        "</button> " +
                        "<button type='button' class='butonEditDelete' id='btnEliminarPieza'> " +
                        "<i class='fa-solid fa-circle-xmark fa-lg' style='color:#FF6961'> </i> " +
                        "</button>" +
                        "</center>";
                }
            },

            
        ],

        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> ',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success',
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> ',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-danger',
            },
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> ',
                titleAttr: 'Imprimir',
                className: 'btn btn-info',
            },
            "pageLength"
        ],

        orderCellsTop: true,
        fixedHeader: true,
        initComplete: function () {
            var api = this.api();

            api
                .columns()
                .eq(0)
                .each(function (colIdx) {

                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" placeholder="Buscar..." class="form-control" />');
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('change', function (e) {
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})';

                            var cursorPosition = this.selectionStart;

                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('keyup', function (e) {
                            e.stopPropagation();

                            $(this).trigger('change');
                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });
                });
        },

        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoThousands": "."
        }
    });

    
});





//cargar select con las categirias
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://agenciavehiculos.azurewebsites.net/api/TipoCategoria",
        dataType: "json",
        success: function(response) {
            response.forEach(function(categoria) {
                $('#categoria').append(new Option(categoria.nombreCategoria, categoria.id));
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar las categorías:", error);
        }
    });
});




//agregar profesor
document.getElementById('agregarPieza')
    .addEventListener('submit', function (event) {
        event.preventDefault();

    
        const { categoria, nombre, descripcion, precio, stock} = getDatosFormularioRegitrarPieza();

        console.log(categoria, nombre, descripcion, precio, stock);


      
       const form_data ={

            idRespuesto: categoria,
            nombreCategoria: nombre,
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            stock: stock
          };


        // Convertir el objeto a una cadena JSON
        const json_data = JSON.stringify(form_data);

         
            $.ajax({
                type: "POST",
                url: "https://agenciavehiculos.azurewebsites.net/api/Repuesto",
                data: json_data,
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    console.log(response);


               
                    
                    
                    if (response === true) {
                       
                        limpiarCamposFormulario();

                        Swal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: 'Pieza registrada correctamente',
                            confirmButtonColor: '#088cff'
                        });


                         tableProfesores.ajax.reload(null, false);
                      

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ocurrió un error, intenta nuevamente',
                            confirmButtonColor: '#088cff'
                        });
                    }

                    
                    

                  
                },
                error: function (xhr, status, error) {
                    console.log(error, xhr, status);

                   
                }
            });
        

        
    });
  


// obtener datos del formulario de registro de profesor
const getDatosFormularioRegitrarPieza = () =>{

    const categoria = document.getElementById("categoria").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const stock = document.getElementById("stock").value.trim();
    
    return {categoria, nombre, descripcion, precio, stock};
};



// limpira campos formulario registar profesor
const limpiarCamposFormulario = () => {
    document.getElementById("nombre").value = '';
    document.getElementById("descripcion").value = '';
    document.getElementById("precio").value = '';
    document.getElementById("stock").value = '';
};





// Actualizar Profesor 
//entra en accion cuando presiono un el boton Editar (Carga los datos en el modal)
$('#myTable tbody').on('click', '#cargarDatosAmodalActualizar', function () {

    console.log("hola");

    
    var data = tableProfesores.row($(this).parents('tr')).data();

    console.log(data);

    
    //setear los inputs del modal con la data de la fila
    $("#idUpdate").val(data["idRespuesto"]);
    $("#nombreUpdate").val(data["nombre"]);
    $("#descripcionUpdate").val(data["descripcion"]);
    $("#precioUpdate").val(data["precio"]);
    $("#stockUpdate").val(data["stock"]);
    

    //entra en accion cuando presiono actualizar profesor
    $("#buttonActualizarPieza").on("click", function (e) {
        e.preventDefault();


        const {id, nombre, descripcion, precio, stock } = getDatosFormularioActulizarPieza();

        console.log( id, nombre, descripcion, precio, stock );

        

        
        
       const form_data ={

        idRespuesto: id,
        nombreCategoria: "string",
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        stock: stock
      };


    // Convertir el objeto a una cadena JSON
    const json_data = JSON.stringify(form_data);

     
        $.ajax({
            type: "PUT",
            url: "https://agenciavehiculos.azurewebsites.net/api/Repuesto",
            data: json_data,
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                console.log(response);


           
                
                if (response === true) {
                   
                    limpiarCamposFormularioActualizar();

                    Swal.fire({
                        icon: 'success',
                        title: '¡Genial!',
                        text: 'Pieza actualizada correctamente',
                        confirmButtonColor: '#088cff'
                    });


                     tableProfesores.ajax.reload(null, false);
                  

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrió un error, intenta nuevamente',
                        confirmButtonColor: '#088cff'
                    });
                }

                
                

              
            },
            error: function (xhr, status, error) {
                console.log(error, xhr, status);

               
            }
        });

          
       

        


    });
    

    
});


// obtener datos del formulario de registro de profesor
const getDatosFormularioActulizarPieza = () =>{
    const id = document.getElementById("idUpdate").value.trim();
    const nombre = document.getElementById("nombreUpdate").value.trim();
    const descripcion = document.getElementById("descripcionUpdate").value.trim();
    const precio = document.getElementById("precioUpdate").value.trim();
    const stock = document.getElementById("stockUpdate").value.trim();

    return {id, nombre, descripcion, precio, stock };
};


// limpiar datos del formulario de actualizar de profesor
const limpiarCamposFormularioActualizar = () =>{

    document.getElementById("idUpdate").value = '';
    document.getElementById("nombreUpdate").value = '';
    document.getElementById("descripcionUpdate").value = '';
    document.getElementById("precioUpdate").value = '';
    document.getElementById("stockUpdate").value = '';

};




// eliminar pieza 
$('#myTable tbody').on('click', '#btnEliminarPieza', function () {
    var data = tableProfesores.row($(this).parents('tr')).data();
    var id = data["idRespuesto"];

    Swal.fire({
        title: "¿Quieres eliminar la pieza?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#FF6961",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {

        if (result.isConfirmed) {
            // Function to make the fetch request and handle the response
            async function eliminarPieza(id) {
                try {
                    const response = await fetch(`https://agenciavehiculos.azurewebsites.net/api/Repuesto?id=${id}`, {
                        method: 'DELETE', // Assuming the API uses DELETE for removal
                    });
                    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    
                    if (result === true) {
                        Swal.fire(
                            'Eliminado!',
                            'La pieza ha sido eliminada.',
                            'success'
                        );
                        // Optionally refresh the table or remove the row
                        tableProfesores.ajax.reload(null, false);
                    } else if (result === false) {
                        Swal.fire(
                            'Error!',
                            'No se pudo eliminar la pieza.',
                            'error'
                        );
                    } else {
                        Swal.fire(
                            'Respuesta inesperada',
                            'El servidor respondió de manera inesperada.',
                            'error'
                        );
                        console.log('Respuesta inesperada:', result);
                    }
                } catch (error) {
                    console.error('Hubo un problema con la solicitud fetch:', error);
                    Swal.fire(
                        'Error!',
                        'Hubo un problema con la solicitud.',
                        'error'
                    );
                }
            }

            eliminarPieza(id);
        }

    });
});



