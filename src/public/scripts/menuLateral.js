// Menu Perfil
const btnPerfil = document.getElementById('ativarMenu');
const menuPerfil = document.getElementById('menuLateral');

// Menu Favoritos
const btnFavoritos = document.getElementById('ativarMenuFavoritos');
const menuFavoritos = document.getElementById('menuLateralfavoritos');

// Perfil
btnPerfil.addEventListener('click', function (event) {
    event.stopPropagation();

    // Fecha favoritos
    menuFavoritos.classList.remove('ativo');

    // Abre/fecha perfil
    menuPerfil.classList.toggle('ativo');
});

// Favoritos
btnFavoritos.addEventListener('click', function (event) {
    event.stopPropagation();

    // Fecha perfil
    menuPerfil.classList.remove('ativo');

    // Abre/fecha favoritos
    menuFavoritos.classList.toggle('ativo');
});

// Fecha tudo ao clicar fora
document.addEventListener('click', function (event) {

    const clicouNoPerfil =
        menuPerfil.contains(event.target) ||
        btnPerfil.contains(event.target);

    const clicouNosFavoritos =
        menuFavoritos.contains(event.target) ||
        btnFavoritos.contains(event.target);

    if (!clicouNoPerfil) {
        menuPerfil.classList.remove('ativo');
    }

    if (!clicouNosFavoritos) {
        menuFavoritos.classList.remove('ativo');
    }
});