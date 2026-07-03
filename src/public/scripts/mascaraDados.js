// Máscara CPF
const cpfInput = document.getElementById('documento');

if (cpfInput) {
    cpfInput.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = valor;
    });
}

// Máscara RG
const rgInput = document.getElementById('rg');

if (rgInput) {
    rgInput.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');

        valor = valor.replace(/(\d{1})(\d{3})(\d{3})/, '$1.$2.$3');

        e.target.value = valor;
    });
}