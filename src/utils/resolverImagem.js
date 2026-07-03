// Resolve a URL correta de uma imagem vinda do banco de dados.
//
// O campo foto_perfil (e cada item de portfolio_midias) pode conter:
//   1. Um NOME DE ARQUIVO local, salvo pelo multer em /public/uploads
//      (ex: "foto_perfil-1782564453338-124765486.jpg")
//   2. Uma URL COMPLETA externa (ex: "https://randomuser.me/...",
//      usada em massas de dados de teste/seed)
//
// Sem esse tratamento, o sistema sempre prefixava com "/uploads/",
// quebrando as URLs externas (virava "/uploads/https://...").
//
// @param {string|null|undefined} valor - foto_perfil ou item de portfolio_midias
// @param {string|null} fallback - imagem padrão caso valor esteja vazio
// @returns {string|null}
function resolverImagem(valor, fallback = '/img/default-user.svg') {

    if (!valor) return fallback;

    // Já é uma URL absoluta (http/https) ou protocol-relative (//...)
    if (/^(https?:)?\/\//i.test(valor)) return valor;

    // Caso contrário, é um arquivo salvo localmente em /public/uploads
    return `/uploads/${valor}`;
}

export default resolverImagem;
