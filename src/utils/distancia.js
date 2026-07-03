// Calcula a distância em quilômetros entre duas coordenadas geográficas
// usando a fórmula de Haversine.

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const raioTerraKm = 6371;

    const dLat = grausParaRadianos(lat2 - lat1);
    const dLon = grausParaRadianos(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(grausParaRadianos(lat1)) * Math.cos(grausParaRadianos(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return raioTerraKm * c;
}

function grausParaRadianos(graus) {
    return graus * (Math.PI / 180);
}

export default calcularDistanciaKm;
