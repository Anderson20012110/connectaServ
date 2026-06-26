const documento =
document.getElementById("documento");

documento.addEventListener("input", ()=>{

    let valor =
    documento.value.replace(/\D/g,'');

    if(valor.length <= 11){

        valor = valor.replace(
            /(\d{3})(\d)/,
            '$1.$2'
        );

        valor = valor.replace(
            /(\d{3})(\d)/,
            '$1.$2'
        );

        valor = valor.replace(
            /(\d{3})(\d{1,2})$/,
            '$1-$2'
        );

    }else{

        valor = valor.replace(
            /^(\d{2})(\d)/,
            '$1.$2'
        );

        valor = valor.replace(
            /^(\d{2})\.(\d{3})(\d)/,
            '$1.$2.$3'
        );

        valor = valor.replace(
            /\.(\d{3})(\d)/,
            '.$1/$2'
        );

        valor = valor.replace(
            /(\d{4})(\d)/,
            '$1-$2'
        );
    }

    documento.value = valor;
});