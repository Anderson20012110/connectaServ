async function carregarFavoritos(){

    const resposta =
        await fetch('/favoritos');

    const favoritos =
        await resposta.json();

    const container =
        document.getElementById(
            'favoritosContainer'
        );

    container.innerHTML = '';

    favoritos.forEach(item => {

        container.innerHTML += `

        <article
            class="pro-card"
            data-favorito-id="${item.id}"
        >

            <div class="card-main">

                <img
                    src="${resolverImagem(item.Prestador.foto_perfil, '/img/default-user.svg')}"
                    class="card-image"
                >

                <div class="card-info">

                    <div class="card-title-row">

                        <h3>
                            ${item.Prestador.Usuario.nome}
                        </h3>

                        <button
                            class="btn-heart-remover"
                            data-favorito-id="${item.id}"
                            data-prestador-id="${item.Prestador.id}"
                        >
                            <i class="fa-solid fa-heart"></i>
                        </button>

                    </div>

                    <p class="profession">
                        ${item.Prestador.cargo}
                    </p>

                </div>

            </div>

        </article>

        `;
    });

}

document.addEventListener(
    'DOMContentLoaded',
    carregarFavoritos
);