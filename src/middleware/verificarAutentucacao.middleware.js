// Middleware de proteção
function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.usuario) {
        return next(); // Usuário está logado, pode prosseguir para a página
    }
    // Se não estiver logado, manda de volta para a tela de login
    res.redirect('/login'); 
}

export default verificarAutenticacao;