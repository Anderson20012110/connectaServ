// Utilitário para converter endereço (CEP/cidade/estado) em coordenadas
// geográficas (latitude/longitude), usando o serviço gratuito Nominatim
// do OpenStreetMap. Não requer chave de API.

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocodifica um endereço brasileiro (CEP, cidade e estado) e retorna
 * as coordenadas geográficas correspondentes.
 *
 * @param {Object} endereco
 * @param {string} [endereco.cep]
 * @param {string} [endereco.cidade]
 * @param {string} [endereco.estado]
 * @returns {Promise<{ latitude: number, longitude: number } | null>}
 */
async function geocodificarEndereco({ cep, cidade, estado }) {
    try {
        const partes = [cep, cidade, estado, 'Brasil'].filter(Boolean);

        if (partes.length === 0) {
            return null;
        }

        const query = partes.join(', ');
        const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;

        const resposta = await fetch(url, {
            headers: {
                // Nominatim exige um User-Agent identificável
                'User-Agent': 'ConectaServ/1.0 (contato@conectaserv.com)'
            }
        });

        if (!resposta.ok) {
            console.error('Falha ao geocodificar endereço:', resposta.status);
            return null;
        }

        const dados = await resposta.json();

        if (!dados || dados.length === 0) {
            return null;
        }

        return {
            latitude: parseFloat(dados[0].lat),
            longitude: parseFloat(dados[0].lon)
        };

    } catch (erro) {
        console.error('Erro ao geocodificar endereço:', erro);
        return null;
    }
}

export default geocodificarEndereco;
