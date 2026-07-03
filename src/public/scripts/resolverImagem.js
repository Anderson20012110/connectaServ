// Resolve a URL correta de uma imagem vinda da API/back-end.
//
// O campo foto_perfil (e cada item de portfolio_midias) pode ser:
//   1. Um NOME DE ARQUIVO local, salvo em /public/uploads pelo multer
//      (ex: "foto_perfil-1782564453338-124765486.jpg")
//   2. Uma URL COMPLETA externa (ex: "https://randomuser.me/...",
//      usada em massas de dados de teste/seed)
//
// Sem esse tratamento, o front-end sempre prefixava com "/uploads/",
// quebrando as URLs externas (virava "/uploads/https://...").
//
// Disponível globalmente (window.resolverImagem) para ser usado em
// qualquer script da página, sem precisar de módulos/import.
function resolverImagem(valor, fallback = null) {

    if (!valor) return fallback;

    // Já é uma URL absoluta (http/https) ou protocol-relative (//...)
    if (/^(https?:)?\/\//i.test(valor)) return valor;

    // Caso contrário, é um arquivo salvo localmente em /public/uploads
    return `/uploads/${valor}`;
}
