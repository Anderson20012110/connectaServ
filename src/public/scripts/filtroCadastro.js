
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const telefone = document.getElementById("telefone");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmarSenha");

    // máscara telefone
    telefone.addEventListener("input", (e) => {

        let valor = e.target.value.replace(/\D/g, "");

        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        e.target.value = valor;
    });

    form.addEventListener("submit", (e) => {

        // senha diferente
        if (senha.value !== confirmarSenha.value) {
            e.preventDefault();
            alert("As senhas não coincidem.");
            confirmarSenha.focus();
            return;
        }

        // senha pequena
        if (senha.value.length < 6) {
            e.preventDefault();
            alert("A senha precisa ter no mínimo 6 caracteres.");
            senha.focus();
            return;
        }

        // telefone incompleto
        if (telefone.value.length < 15) {
            e.preventDefault();
            alert("Digite um telefone válido.");
            telefone.focus();
            return;
        }

    });

});
