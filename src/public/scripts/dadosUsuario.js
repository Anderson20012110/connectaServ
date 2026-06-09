async function carregarUsuario() {

    const resposta = await fetch('/usuario-logado');
    const usuario = await resposta.json();

    document.getElementById('nomeLogin').textContent = `Olá, ${usuario.nome}`;
    console.log(usuario)
}

carregarUsuario();