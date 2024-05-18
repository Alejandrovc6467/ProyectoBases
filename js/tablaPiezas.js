

// cargar tabla profesores
var tableProfesores = null;
$(document).ready(function () {
    $('#myTable thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#myTable thead');

        
    tableProfesores = $('#myTable').DataTable({

        "ajax": {
            "url": "http://localhost:5080/api/Repuesto",
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
                        "<button type='button' class='butonEditDelete' data-bs-toggle='modal' data-bs-target='#actualizarProfesorModal' id='btnAbrirActualizarProfesorModal'> " +
                        "<i class='fa-solid fa-pen-to-square fa-lg' style='color: #6198ff'></i> " +
                        "</button> " +
                        "<button type='button' class='butonEditDelete' id='btnEliminarProfesor'> " +
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






$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5080/api/TipoCategoria",
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
                url: "http://localhost:5080/api/Repuesto",
                data: json_data,
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    console.log(response);


               
                    
                    
                    if (response === true) {
                       
                        //limpiarCamposFormulario();

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



/*

// limpira campos formulario registar profesor
const limpiarCamposFormulario = () => {
    document.getElementById("cedula").value = '';
    document.getElementById("nombre").value = '';
    document.getElementById("apellido1").value = '';
    document.getElementById("apellido2").value = '';
};


//validar la cedula con expresion regular
const validarCedula = (cedula)=>{

    const regex = /^[0-9-]+$/;
       
    if(!( cedula.length === 11 && regex.test(cedula) ) ){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Formato de Cédula incorrecto',
            confirmButtonColor: '#088cff'
        })

        return false;
    }else{
        return true;
    }
};
    

// Obtener el campo de entrada del input cedula en directo
document.getElementById("cedula").addEventListener("input", function() {
    // Obtener el valor actual del campo
    var valor = this.value;
                
    // Eliminar cualquier carácter que no sea un dígito o un guión
    valor = valor.replace(/[^\d-]/g, "");
    
    // Limitar la longitud de la cadena a 12 caracteres (#-####-####)
    valor = valor.slice(0, 11);
    
    // Verificar si la longitud actual permite insertar el guión automáticamente
    if (valor.length > 1 && valor.charAt(1) !== '-') {
        valor = valor.slice(0, 1) + '-' + valor.slice(1);
    }
    if (valor.length > 6 && valor.charAt(6) !== '-') {
        valor = valor.slice(0, 6) + '-' + valor.slice(6);
    }
    
    // Actualizar el valor del campo con la máscara aplicada
    this.value = valor;
         
});


  




// Actualizar Profesor 
//entra en accion cuando presiono un el boton Editar (Carga los datos en el modal)
$('#myTable tbody').on('click', '#btnAbrirActualizarProfesorModal', function () {
    var data = tableProfesores.row($(this).parents('tr')).data();

    //setear los inputs del modal con la data de la fila
    $("#cedula_actualizarProfesor").val(data["cedula"]);
    $("#nombre_actualizarProfesor").val(data["nombre"]);
    $("#apellido1_actualizarProfesor").val(data["apellido1"]);
    $("#apellido2_actualizarProfesor").val(data["apellido2"]);

    //entra en accion cuando presiono actualizar profesor
    $("#btnActualizarProfesor").on("click", function (e) {
        e.preventDefault();


        const { cedula, nombre, apellido1, apellido2 } = getDatosFormularioActulizarProfesor();

        console.log( cedula, nombre, apellido1, apellido2 );

        const datosValidos = validarCedula(cedula) && nombre != '' && apellido1 != '' && apellido2 != ''  ;

        
        if (datosValidos) {


            $.ajax({
                url: "?controlador=Profesor&accion=actualizarProfesor",
                type: "POST",
                data: {
                    cedula: cedula,
                    nombre: nombre,
                    apellido1: apellido1,
                    apellido2: apellido2
                },
                success: function (response) {
                    // Actualizar la fila correspondiente en la tabla
                    console.log(response);
    
                    if (response[0]["1"] === 1) {
    
                        Swal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: 'Profesor actualizado correctamente',
                            confirmButtonColor: '#088cff'
                        });
    
                        tableProfesores.ajax.reload(null, false);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Usuario no registrado',
                            confirmButtonColor: '#088cff'
                        })
                    }
    
                    // Cerrar el modal
                    $("#actualizarProfesorModal").modal("hide");
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });

          
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Completa todos los campos',
                confirmButtonColor: '#088cff'
            })
        }


    });
});


// obtener datos del formulario de registro de profesor
const getDatosFormularioActulizarProfesor = () =>{
    const cedula = document.getElementById("cedula_actualizarProfesor").value.trim();
    const nombre = document.getElementById("nombre_actualizarProfesor").value.trim();
    const apellido1 = document.getElementById("apellido1_actualizarProfesor").value.trim();
    const apellido2 = document.getElementById("apellido2_actualizarProfesor").value.trim();
    
    return {cedula, nombre, apellido1, apellido2};
};





// eliminar Profesor 
$('#myTable tbody').on('click', '#btnEliminarProfesor', function () {

    var data = tableProfesores.row($(this).parents('tr')).data();
    var cedula = data["cedula"];

    Swal.fire({
        title: "¿Quieres eliminar al profesor?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#FF6961",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {



        if (result.isConfirmed) {

            // revisar que no este en ninguna tesina o sino no lo puedo borrar

            $.ajax({
                url: "?controlador=Profesor&accion=eliminarProfesor",
                type: "POST",
                data: { cedula: cedula },
                success: function (response) {

                    if (response[0]["mensaje"] === "Profesor borrado correctamente") {

                        tableProfesores.ajax.reload(null, false);

                        Swal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: 'Profesor eliminado correctamente',
                            confirmButtonColor: '#088cff'
                        });

                    } else if(response[0]["mensaje"] === "No puedes borrar este profesor porque está asociado a una tesina") {

                        tableProfesores.ajax.reload(null, false);

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No puedes borrar este profesor porque está asociado a una tesina',
                            confirmButtonColor: '#088cff'
                        })
                       
                    }


                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });
        }



    });


});

*/
