



// Formulario Registro de usuarios 
document.addEventListener("DOMContentLoaded", ()=>{

    const formularioRegistro = document.getElementById("registrarUsuario");

    formularioRegistro.addEventListener("submit", (event)=>{
        event.preventDefault()
        

        const { nombre, apellidos,direccion, telefono, correo, contrasenia, contraseniaVerificacion} = getDatosFormularioRegitroUsuario();

        console.log( nombre, apellidos,direccion, telefono, correo, contrasenia, contraseniaVerificacion);



       

        if( verificarIgualdadPassword(contrasenia, contraseniaVerificacion) ){

           registarUsuario( nombre, apellidos, direccion, telefono, correo, contrasenia);


          
    
        }
        
      
        
    });

});



//obtener datos del formulario
const getDatosFormularioRegitroUsuario = ()=>{

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();
    const contraseniaVerificacion = document.getElementById("contrasenia_verificacion").value.trim();

    return {nombre, apellidos,direccion, telefono, correo, contrasenia, contraseniaVerificacion};
};



//****************** validaciones de los datos *******************







const validarNombre = (nombre)=>{

    const regex = /^[a-zA-Z\s]+$/;
    if( !(nombre.length <= 20  &&  regex.test(nombre)) ){
        mostrarModalNotificacion("El nombre debe contener solo letras y un maximo de 20 caracteres");
        return false;
    }else{
        return true;
    }
};

// Obtener el campo de entrada del input nombre en directo
document.getElementById("nombre").addEventListener("input", function() {
    // Obtener el valor actual del campo
    var valor = this.value;
            
    // Eliminar cualquier carácter que no sea una letra
  
    valor = valor.replace(/[^a-zA-Z\s]/g, "");


    // Limitar la longitud de la cadena a 20 caracteres
    valor = valor.slice(0, 20);

    // Actualizar el valor del campo con la entrada válida
    this.value = valor;
});



const validarApellidos = (apellidos)=>{

    const regex = /^[a-zA-Z\s]+$/;
    if(  !(apellidos.length <= 30  &&  regex.test(apellidos)) ){
        mostrarModalNotificacion("El apellido debe contener solo letras y un maximo de 30 caracteres");
        return false;
    }else{
        return true;
    }
};


// Obtener el campo de entrada del input apellidos en directo
document.getElementById("apellidos").addEventListener("input", function() {
    // Obtener el valor actual del campo
    var valor = this.value;
            
    // Eliminar cualquier carácter que no sea una letra
    valor = valor.replace(/[^a-zA-Z\s]/g, "");

    // Limitar la longitud de la cadena a 20 caracteres
    valor = valor.slice(0, 30);

    // Actualizar el valor del campo con la entrada válida
    this.value = valor;
});



const validarTelefono = (telefono)=>{
    const regex = /^[0-9-]+$/;
   
    if( !(telefono.length === 9 && regex.test(telefono)) ){
        mostrarModalNotificacion("El telefono debe ser formato ####-####");
        return false;
    }else{
        return true;
    }
};


document.getElementById("telefono").addEventListener("input", function() {
    // Obtener el valor actual del campo
    var valor = this.value;
    
    // Eliminar cualquier carácter que no sea un dígito
    valor = valor.replace(/[^\d-]/g, "");

    // Limitar la longitud de la cadena a 8 caracteres
    valor = valor.slice(0, 9);

    // Insertar el guión después de los primeros 4 caracteres si la longitud actual es mayor que 4
    if (valor.length > 4 && valor.charAt(4) !== '-') {
        valor = valor.slice(0, 4) + '-' + valor.slice(4);
    }

    // Actualizar el valor del campo con la máscara aplicada
    this.value = valor;
});


// poner le modal en vez del Alert si tengo tiempo
const validarEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(!regex.test(email)){
        mostrarModalNotificacion("Introduce un correo válido.");
        return false; 
    }else{
        return true;
    }
};


// poner le modal en vez del Alert si tengo tiempo
const validarPassword = (password)=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!passwordRegex.test(password)){
        mostrarModalNotificacion("Introduce una contraseña con letras mayúsculas, minúsculas, numeros, simbolos y almenos 8 dígitos.");
    }
    return passwordRegex.test(password);
};



const verificarIgualdadPassword = (contrasenia, contraseniaVerificacion) =>{

    if(contrasenia !== contraseniaVerificacion){
       
        
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Las contraseñas son diferentes',
            confirmButtonColor: '#088cff'
        });

        return false;
    }else{
        return true;
    }
};








const registarUsuario = ( nombre, apellidos, direccion, telefono, correo, contrasenia) =>{

    console.log( nombre, apellidos, direccion, telefono, correo, contrasenia);

    var contraseniaHash = encriptarPassword(contrasenia);

    console.log(contraseniaHash);
    
   
    const form_data ={
     id: 0,
     nombre: nombre,
     apellido: apellidos,
     direccion: direccion,
     telefono: telefono,
     correo: correo,
     contrasenia: contraseniaHash
   };


  

     // Convertir el objeto a una cadena JSON
     const json_data = JSON.stringify(form_data);

  
 
     $.ajax({
         type: "PUT",
         url: "https://agenciavehiculos.azurewebsites.net/api/Cliente",
         data: json_data,
         contentType: "application/json",
         dataType: "json",
         success: function (response) {
             console.log(response);


        
             
             
             if (response === true) {
                
                 limpiarCamposTexto()

                 Swal.fire({
                     icon: 'success',
                     title: '¡Genial!',
                     text: 'Usuario registrado correctamente',
                     confirmButtonColor: '#088cff'
                 });


               

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
    

};





//solo uno para registro porque en login pasa directo a otra pagina
const limpiarCamposTexto = () => {

    const camposTexto = document.querySelectorAll('#registrarUsuario input[type="text"], #registrarUsuario input[type="email"], #registrarUsuario input[type="password"]');
    
    camposTexto.forEach(campo => {
        campo.value = '';
    });

};






//****************** Registro*******************


// esta funcion deberia ir en el getUsuariosMedicosCitas *********
const registrarUsuarioEnLocalStorage = (cedula, nombre, apellidos, telefono, correo, contrasenia) => {

    var usuarios = getUsuarios();

    var contraseniaHash = encriptarPassword(contrasenia);

    console.log(contraseniaHash);
    
    
    const nuevoUsuario = {
        cedula: cedula,
        nombre: nombre,
        apellidos: apellidos,
        telefono: telefono,
        correo: correo,
        contrasenia: contraseniaHash,
        rol: "usuario"
    };
   
    usuarios.push(nuevoUsuario);
  
    // puse esto en un if para ver si me mostrba un true o false, pero no retorna nada, entonces voy a retornar un trie siempre abajo para indicar que todo salio bien
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

  
    return true;
   
};




const verificarExistenciaUsuario = (cedula) => {

   
    var usuarios = getUsuarios();

    for (let i = 0; i < usuarios.length; i++) {
       
        if (usuarios[i].cedula === cedula) {
            return false;
        }
    }
   
    return true;
};