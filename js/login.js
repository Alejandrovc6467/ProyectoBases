// Formulario Login
document.addEventListener("DOMContentLoaded", ()=>{

    const formularioLogin = document.getElementById("login");

    formularioLogin.addEventListener("submit", (event)=>{
        event.preventDefault()

        const {Correo, contrasenia} = getDatosFormulario();

        console.log(Correo, contrasenia);

        //console.log(getUsuarios(), "desde el login event solo para ver los usuarios registrados")

        const esValido = verificarLogin(Correo, contrasenia);

        console.log(esValido);

       // esValido ? inicioSesionExitoso(Correo) : errorInicioSesion();

     
    });

});


//obtener los datos del formulario
const getDatosFormulario = ()=>{
    const Correo = document.getElementById("Correo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();;
    return {Correo, contrasenia};
};





const verificarLogin = (correo, contrasenia) => {
    const uri = 'http://localhost:5140/api/Cliente';

    fetch(`${uri}/${correo},${contrasenia}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
    })
    .then(response => {

        console.log(response);
        // Aquí puedes manejar los diferentes casos dependiendo del retorno de la API
        if (response) {

            
            console.log("entra");
       

            inicioSesionExitoso(correo);
           
        } else {

            errorInicioSesion();
          
           
        }
    })
    .catch(error => console.error("No se ha podido autenticar un cliente", error));
};







// inicio de sesion exitoso, se invoca si todo sale bien al momento del logueo
const inicioSesionExitoso = (cedula)=>{

    const sesionUser = {
        cedula: cedula
    };
   
    localStorage.setItem("sesionUser", JSON.stringify(sesionUser));
 
    sessionStorage.setItem("sesionUser", JSON.stringify(sesionUser));

  // nuevo para base de datos, si el rol es admin enviarlo a la pagina admin.html


  if(cedula === "admin@gmail.com"){
    window.location.href = 'admin.html';// redireciono a agendarcita
  }else{
    window.location.href = 'agendarCita.html';// redireciono a agendarcita
  }

   
   
};

//se invoca si hay un error en l sessio
const errorInicioSesion = ()=>{
    //aqui deberia de hacer la logica de inicios de sesion fallidos, revisar primero si esa cedula existe
   
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Datos incorrectos',
        confirmButtonColor: '#088cff'
    });


};



/*


 Swal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: 'Profesor eliminado correctamente',
                            confirmButtonColor: '#088cff'
                        });


*/


/*
 Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No puedes borrar este profesor porque está asociado a una tesina',
                            confirmButtonColor: '#088cff'
                        })

*/