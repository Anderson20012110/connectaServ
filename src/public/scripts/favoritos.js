document.addEventListener('click', async (e) => {

    const botao = e.target.closest('.btn-favorite');

    if (!botao) return;

    const prestadorId = botao.dataset.prestadorId;

    const favoritado =
        botao.classList.contains('favoritado');

    try {

        if (!favoritado) {

            await fetch('/favoritar', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json'

                },

                body: JSON.stringify({

                    prestador_id: prestadorId

                })

            });

            botao.classList.add('favoritado');

            botao.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

        } else {

            await fetch(

                `/favoritar/${prestadorId}`,

                {

                    method: 'DELETE'

                }

            );

            botao.classList.remove('favoritado');

            botao.innerHTML =
                '<i class="fa-regular fa-heart"></i>';

        }

        carregarFavoritos();

    } catch (erro) {

        console.error(erro);

    }

});