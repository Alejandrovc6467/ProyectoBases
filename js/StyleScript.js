

// Colocar un border shadow botton en el navbar cuando el scrollY baja a 50 ***********************************
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('header');
    if (window.scrollY > 50) { // Cambia 50 por la cantidad de desplazamiento que desees
      navbar.classList.add('shadow');
    } else {
      navbar.classList.remove('shadow');
    }
});

