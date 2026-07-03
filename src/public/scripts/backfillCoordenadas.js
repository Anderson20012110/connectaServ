// Script utilitário: geocodifica os prestadores já cadastrados que ainda
// não possuem latitude/longitude salvas (registros criados antes da
// funcionalidade de busca por proximidade).
//
// Uso:  node src/scripts/backfillCoordenadas.js

import sequelize from '../config/database.config.js';
import Prestador from '../models/prestador.models.js';
import geocodificarEndereco from '../utils/geocode.js';

function aguardar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {

    await sequelize.authenticate();

    const prestadores = await Prestador.findAll({
        where: { latitude: null }
    });

    console.log(`Encontrados ${prestadores.length} prestador(es) sem coordenadas.`);

    for (const prestador of prestadores) {

        const coordenadas = await geocodificarEndereco({
            cep: prestador.cep,
            cidade: prestador.cidade,
            estado: prestador.estado
        });

        if (coordenadas) {
            await prestador.update({
                latitude: coordenadas.latitude,
                longitude: coordenadas.longitude
            });
            console.log(`✔ Prestador #${prestador.id} geocodificado: ${coordenadas.latitude}, ${coordenadas.longitude}`);
        } else {
            console.warn(`✘ Não foi possível geocodificar o prestador #${prestador.id} (${prestador.cidade}/${prestador.estado})`);
        }

        // Respeita o limite de 1 requisição por segundo do Nominatim
        await aguardar(1100);
    }

    console.log('Concluído.');
    process.exit(0);
}

main().catch((erro) => {
    console.error('Erro ao rodar o backfill de coordenadas:', erro);
    process.exit(1);
});
