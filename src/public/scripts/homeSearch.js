// Funcionalidade da barra de busca e dos cards de categoria da homeLogado:
//
// 1. Ao carregar a página, pede a localização do navegador (Geolocation API)
//    e converte as coordenadas em "Cidade, UF" via geocodificação reversa
//    (Nominatim/OpenStreetMap), exibindo o resultado dinamicamente dentro de
//    #txt-end (".box-serach-endereco").
// 2. Guarda as coordenadas obtidas para reaproveitar tanto no clique em
//    "Buscar" quanto no clique em qualquer card de categoria.
// 3. Ao clicar em "Buscar" (ou apertar Enter no campo de busca), redireciona
//    para /buscar?q=<termo>&lat=<lat>&lng=<lng>.
// 4. Ao clicar em um card de categoria, redireciona para
//    /buscar?categoria=<categoria>&lat=<lat>&lng=<lng>, usando o
//    data-categoria de cada card (os mesmos valores salvos no cadastro do
//    prestador: reformas, eletrica, beleza, aulas).
//
// A página /buscar (search.ejs + mapa.js) é responsável por ler esses
// parâmetros da URL e filtrar os prestadores exibidos no mapa/lista.

(function () {

    const inputBusca = document.getElementById('homeBuscaInput');
    const txtEndereco = document.getElementById('txt-end');
    const btnBuscar = document.getElementById('btnBuscarHome');
    const cardsCategoria = document.querySelectorAll('.category-card[data-categoria]');

    if (!txtEndereco) return;

    const ENDERECO_PADRAO = 'Recife, PE';

    let coordenadasUsuario = null; // { lat, lng }

    // --- Geolocalização + geocodificação reversa ---

    function detectarLocalizacao() {

        // Reaproveita a localização já detectada nesta sessão do navegador,
        // evitando pedir permissão de geolocalização de novo a cada
        // navegação entre homeLogado e a página de busca.
        const cache = sessionStorage.getItem('connectaserv_localizacao');

        if (cache) {

            try {

                const dados = JSON.parse(cache);
                coordenadasUsuario = { lat: dados.lat, lng: dados.lng };
                txtEndereco.textContent = dados.endereco || ENDERECO_PADRAO;
                return;

            } catch (erro) {
                // cache inválido, segue para nova detecção
            }
        }

        if (!('geolocation' in navigator)) {
            txtEndereco.textContent = ENDERECO_PADRAO;
            return;
        }

        navigator.geolocation.getCurrentPosition(

            async (posicao) => {

                const { latitude, longitude } = posicao.coords;
                coordenadasUsuario = { lat: latitude, lng: longitude };

                const enderecoTexto = await reverseGeocode(latitude, longitude);

                txtEndereco.textContent = enderecoTexto || ENDERECO_PADRAO;

                sessionStorage.setItem('connectaserv_localizacao', JSON.stringify({
                    lat: latitude,
                    lng: longitude,
                    endereco: enderecoTexto || ENDERECO_PADRAO
                }));

            },

            (erro) => {
                console.warn('Não foi possível obter a localização:', erro.message);
                txtEndereco.textContent = ENDERECO_PADRAO;
            },

            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }

    // Converte coordenadas (lat/lng) em "Cidade, UF" usando o serviço
    // gratuito de geocodificação reversa do OpenStreetMap (Nominatim)
    async function reverseGeocode(lat, lng) {

        try {

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
            const resposta = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });

            if (!resposta.ok) return null;

            const dados = await resposta.json();
            const endereco = dados.address || {};

            const cidade = endereco.city || endereco.town || endereco.village || endereco.municipality;
            const estado = endereco.state_code || endereco['ISO3166-2-lvl4']?.split('-')[1] || endereco.state;

            if (cidade && estado) return `${cidade}, ${estado}`;
            if (cidade) return cidade;

            return null;

        } catch (erro) {
            console.warn('Erro na geocodificação reversa:', erro);
            return null;
        }
    }

    // --- Navegação para a página de busca ---

    function irParaBusca(paramsExtras) {

        const params = new URLSearchParams();

        Object.entries(paramsExtras || {}).forEach(([chave, valor]) => {
            if (valor) params.set(chave, valor);
        });

        if (coordenadasUsuario) {
            params.set('lat', coordenadasUsuario.lat);
            params.set('lng', coordenadasUsuario.lng);
        }

        window.location.href = `/buscar?${params.toString()}`;
    }

    function buscarPorTexto() {
        const termo = inputBusca ? inputBusca.value.trim() : '';
        irParaBusca({ q: termo });
    }

    function buscarPorCategoria(categoria) {
        irParaBusca({ categoria });
    }

    // --- Eventos ---

    if (btnBuscar) btnBuscar.addEventListener('click', buscarPorTexto);

    if (inputBusca) {
        inputBusca.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') buscarPorTexto();
        });
    }

    cardsCategoria.forEach((card) => {
        card.addEventListener('click', () => {
            buscarPorCategoria(card.dataset.categoria);
        });
    });

    detectarLocalizacao();

})();
