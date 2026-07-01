const cep = document.getElementById("cep");

cep.addEventListener("input", (e)=>{

    let valor = e.target.value
        .replace(/\D/g,"")
        .slice(0,8);

    if(valor.length > 5){
        valor =
            valor.substring(0,5)
            + "-"
            + valor.substring(5);
    }

    e.target.value = valor;
});