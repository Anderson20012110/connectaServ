cep.addEventListener("blur", async ()=>{

    const valor = cep.value.replace(/\D/g,'');

    if(valor.length !== 8){
        return;
    }

    try{

        const response =  await fetch(`https://viacep.com.br/ws/${valor}/json/`);
        const data = await response.json();

        if ( data.erro ) {
            alert("CEP não encontrado");
            return;
        }

        const cidade = document.getElementById("cidade");
        const estado = document.getElementById("estado");

        cidade.value = data.localidade;
        estado.value = data.uf;

        cidade.classList.add("field-loaded");
        estado.classList.add("field-loaded");

        setTimeout(() => {
            cidade.classList.remove("field-loaded");
            estado.classList.remove("field-loaded");
        }, 800);

    }catch(error){

        console.error(error);

        alert("Erro ao consultar CEP");
    }
});