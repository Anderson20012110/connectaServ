// Página de busca (/buscar): mostra no mapa (Leaflet + OpenStreetMap) os
// profissionais mais próximos da localização do usuário, filtrados pelo
// termo pesquisado. Fluxo:
//   1. Obtém a localização do usuário (via URL, se veio da homeLogado, ou
//      via Browser Geolocation API)
//   2. Busca prestadores próximos no back-end (/api/prestadores/proximos)
//   3. Exibe marcadores no mapa e cards na lista lateral

(function () {

    const CENTRO_PADRAO = { lat: -8.0578, lng: -34.8829 }; // Recife, PE (fallback)

    const elMapa = document.getElementById('map');
    const elSearchInput = document.getElementById('searchInput');
    const elBtnSearch = document.getElementById('btnSearch');
    const elResultsCount = document.getElementById('resultsCount');
    const elCardsList = document.getElementById('cardsList');
    const elCardsEmpty = document.getElementById('cardsEmpty');
    const elTxtEndereco = document.getElementById('txt-end');

    if (!elMapa) return;

    const params = new URLSearchParams(window.location.search);
    let termoBusca = params.get('q') || '';
    let categoriaAtual = params.get('categoria') || '';

    if (elSearchInput) elSearchInput.value = termoBusca;

    let userCoords = null;

    const latParam = parseFloat(params.get('lat'));
    const lngParam = parseFloat(params.get('lng'));
    if (!isNaN(latParam) && !isNaN(lngParam)) {
        userCoords = { lat: latParam, lng: lngParam };
    }

    // --- Inicialização do mapa ---
    const centroInicial = userCoords || CENTRO_PADRAO;

    const map = L.map('map').setView([centroInicial.lat, centroInicial.lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marcadorUsuario = null;
    let marcadoresPrestadores = []; // [{ id, marker }]

    function iconeUsuario() {
        return L.divIcon({
            className: 'user-location-icon',
            html: '<div class="map-pin active"><div class="pin-pulse"></div><div class="pin-inner"></div></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }

    function iconePrestador() {
        return L.divIcon({
            className: 'provider-location-icon',
            html: '<div class="map-pin"><div class="pin-inner"></div></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    function definirMarcadorUsuario(coords) {
        if (marcadorUsuario) map.removeLayer(marcadorUsuario);

        marcadorUsuario = L.marker([coords.lat, coords.lng], { icon: iconeUsuario(), zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup('Você está aqui');
    }

    // --- Obtenção da localização do usuário ---
    function obterLocalizacao() {
        return new Promise((resolve) => {

            if (userCoords) {
                resolve(userCoords);
                return;
            }

            if (!('geolocation' in navigator)) {
                resolve(CENTRO_PADRAO);
                return;
            }

            navigator.geolocation.getCurrentPosition(

                (posicao) => {
                    userCoords = { lat: posicao.coords.latitude, lng: posicao.coords.longitude };
                    resolve(userCoords);
                },

                (erro) => {
                    console.warn('Não foi possível obter localização, usando padrão:', erro.message);
                    resolve(CENTRO_PADRAO);
                },

                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        });
    }

    // --- Busca de prestadores no back-end ---
    async function buscarPrestadores(coords, termo, categoria) {

        if (elResultsCount) elResultsCount.textContent = 'Buscando profissionais...';

        try {

            const qs = new URLSearchParams();
            if (termo) qs.set('q', termo);
            if (categoria) qs.set('categoria', categoria);
            qs.set('lat', coords.lat);
            qs.set('lng', coords.lng);

            const resposta = await fetch(`/api/prestadores/proximos?${qs.toString()}`);
            const dados = await resposta.json();

            if (!dados.sucesso) throw new Error(dados.erro || 'Erro ao buscar profissionais');

            renderizarResultados(dados.prestadores);

        } catch (erro) {
            console.error(erro);
            if (elResultsCount) elResultsCount.textContent = 'Erro ao buscar profissionais';
        }
    }

    // --- Renderização de marcadores e cards ---
    function renderizarResultados(prestadores) {

        marcadoresPrestadores.forEach(({ marker }) => map.removeLayer(marker));
        marcadoresPrestadores = [];

        if (elCardsList) {
            elCardsList.querySelectorAll('.pro-card').forEach(card => card.remove());
        }

        if (elResultsCount) {
            const sufixoCategoria = categoriaAtual ? ` em "${nomeCategoria(categoriaAtual)}"` : '';
            elResultsCount.textContent = prestadores.length === 1
                ? `1 profissional encontrado${sufixoCategoria}`
                : `${prestadores.length} profissionais encontrados${sufixoCategoria}`;
        }

        if (elCardsEmpty) elCardsEmpty.style.display = prestadores.length === 0 ? 'block' : 'none';

        const limitesMapa = [];

        if (userCoords) limitesMapa.push([userCoords.lat, userCoords.lng]);

        prestadores.forEach(prestador => {

            if (prestador.latitude !== null && prestador.longitude !== null) {

                const marker = L.marker([prestador.latitude, prestador.longitude], { icon: iconePrestador() })
                    .addTo(map)
                    .bindPopup(montarPopup(prestador));

                marker.on('click', () => destacarCard(prestador.id));

                marcadoresPrestadores.push({ id: prestador.id, marker });
                limitesMapa.push([prestador.latitude, prestador.longitude]);
            }

            if (elCardsList) elCardsList.appendChild(montarCard(prestador));
        });

        if (limitesMapa.length > 1) {
            map.fitBounds(limitesMapa, { padding: [40, 40], maxZoom: 15 });
        } else if (limitesMapa.length === 1) {
            map.setView(limitesMapa[0], 14);
        }
    }

    function montarPopup(prestador) {
        const div = document.createElement('div');
        div.className = 'map-popup';
        div.innerHTML = `
            <strong>${escapeHtml(prestador.nome)}</strong><br>
            <span>${escapeHtml(prestador.cargo || '')}</span><br>
            <a href="/perfil/${prestador.id}">Ver perfil</a>
        `;
        return div;
    }

    function montarCard(prestador) {

        const article = document.createElement('article');
        article.className = 'pro-card';
        article.dataset.prestadorId = prestador.id;

        const fotoSrc = resolverImagem(prestador.foto_perfil)
            || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prestador.nome)}`;

        const distanciaTexto = prestador.distancia_km !== null
            ? `📍 ${prestador.distancia_km} km`
            : '📍 distância indisponível';

        const tags = [prestador.categoria, ...prestador.servicos.slice(0, 2).map(s => s.nome)]
            .filter(Boolean)
            .slice(0, 3);

        const preco = prestador.preco_base ? Number(prestador.preco_base).toFixed(2).replace('.', ',') : '0,00';

        article.innerHTML = `
            <button class="favorite-btn btn-favorite" data-prestador-id="${prestador.id}">
                <i class="fa-regular fa-heart"></i>
            </button>

            <div class="card-info">
                <img src="${fotoSrc}" alt="${escapeHtml(prestador.nome)}" class="avatar">
                <div class="details">
                    <h3>${escapeHtml(prestador.nome)}</h3>
                    <p class="profession">${escapeHtml(prestador.cargo || 'Profissional')}</p>
                    <div class="meta">
                        <span class="distance">${distanciaTexto}</span>
                    </div>
                    <div class="tags">
                        ${tags.map(tag => `<span>#${escapeHtml(tag.toLowerCase().replace(/\s+/g, ''))}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <span class="price">A partir de R$ ${preco}</span>
                <a href="/perfil/${prestador.id}" class="view-profile">Ver Perfil</a>
            </div>
        `;

        article.addEventListener('click', (e) => {
            if (e.target.closest('.btn-favorite') || e.target.closest('.view-profile')) return;
            focarPrestador(prestador.id);
        });

        return article;
    }

    function focarPrestador(prestadorId) {
        const encontrado = marcadoresPrestadores.find(m => m.id === prestadorId);
        if (!encontrado) return;

        map.setView(encontrado.marker.getLatLng(), 15, { animate: true });
        encontrado.marker.openPopup();

        destacarCard(prestadorId);
    }

    function destacarCard(prestadorId) {
        if (!elCardsList) return;

        elCardsList.querySelectorAll('.pro-card').forEach(card => {
            card.classList.toggle('active', Number(card.dataset.prestadorId) === prestadorId);
        });

        const card = elCardsList.querySelector(`.pro-card[data-prestador-id="${prestadorId}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Traduz o valor salvo em "categoria" (ex: "eletrica") para um rótulo
    // amigável (ex: "Elétrica"), usado apenas para exibição.
    function nomeCategoria(categoria) {
        const nomes = {
            reformas: 'Reformas',
            eletrica: 'Elétrica',
            beleza: 'Beleza',
            aulas: 'Aulas'
        };
        return nomes[categoria.toLowerCase()] || categoria;
    }

    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto ?? '';
        return div.innerHTML;
    }

    // --- Nova busca (botão/Enter) ---
    // Uma nova digitação na barra de busca refina o texto pesquisado, mas
    // mantém a categoria selecionada anteriormente (se o usuário chegou
    // até aqui clicando em um card de categoria na homeLogado).
    function executarNovaBusca() {
        termoBusca = elSearchInput ? elSearchInput.value.trim() : '';

        const novosParams = new URLSearchParams(window.location.search);
        if (termoBusca) novosParams.set('q', termoBusca); else novosParams.delete('q');
        if (categoriaAtual) novosParams.set('categoria', categoriaAtual);
        window.history.replaceState({}, '', `${window.location.pathname}?${novosParams.toString()}`);

        buscarPrestadores(userCoords || CENTRO_PADRAO, termoBusca, categoriaAtual);
    }

    if (elBtnSearch) elBtnSearch.addEventListener('click', executarNovaBusca);
    if (elSearchInput) {
        elSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executarNovaBusca();
        });
    }

    // --- Exibição dinâmica de "Cidade, UF" (quando a página tiver o
    // elemento #txt-end, como na barra de busca da homeLogado) ---
    async function exibirEnderecoUsuario(coords) {
        if (!elTxtEndereco) return;

        const enderecoParam = params.get('local');
        if (enderecoParam) {
            elTxtEndereco.textContent = enderecoParam;
            return;
        }

        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=10&addressdetails=1`;
            const resposta = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
            if (!resposta.ok) throw new Error('Falha na geocodificação reversa');

            const dados = await resposta.json();
            const endereco = dados.address || {};
            const cidade = endereco.city || endereco.town || endereco.village || endereco.municipality;
            const estado = endereco.state_code || endereco['ISO3166-2-lvl4']?.split('-')[1] || endereco.state;

            elTxtEndereco.textContent = (cidade && estado) ? `${cidade}, ${estado}` : (cidade || 'Localização não identificada');

        } catch (erro) {
            console.warn('Erro na geocodificação reversa:', erro);
            elTxtEndereco.textContent = 'Recife, PE';
        }
    }

    // --- Fluxo inicial ---
    obterLocalizacao().then((coords) => {
        userCoords = coords;
        map.setView([coords.lat, coords.lng], 13);
        definirMarcadorUsuario(coords);
        exibirEnderecoUsuario(coords);
        buscarPrestadores(coords, termoBusca, categoriaAtual);
    });

})();
