document.addEventListener(
    'click',
    async (e) => {

        const botao =
            e.target.closest(
                '.btn-heart-remover '
            );

        if(!botao) return;

        const prestadorId = botao.dataset.prestadorId;
        const favoritoId = botao.dataset.favoritoId;

        await fetch(
            `/favoritar/${favoritoId}`,
            {
                method:'DELETE'
            }
        );

        botao
            .closest('.pro-card')
            .remove();

        const btnFavoriteMain = document.querySelector(`.btn-favorite[data-prestador-id="${prestadorId}"]`);
        if (btnFavoriteMain) {
            btnFavoriteMain.classList.remove('favoritado');
            btnFavoriteMain.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }

});