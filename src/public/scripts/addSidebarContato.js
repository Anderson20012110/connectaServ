
document.addEventListener('DOMContentLoaded', () => {

    const btnSolicitar = document.getElementById('btnSolicitar');
    const sidebarContato = document.querySelector('.sidebar-contato');
    const fecharContato = document.querySelector('.header-sidebar-contato i');
    const telefone = document.getElementById('telefoneContato');
    const email = document.getElementById('emailContato');

    if (btnSolicitar) {

        btnSolicitar.addEventListener('click', async () => {

            const usuarioId = btnSolicitar.dataset.usuario;

            try {

                const response = await fetch(`/api/usuario/${usuarioId}/contato`);
                const dados = await response.json();

                telefone.textContent = dados.telefone;
                email.textContent = dados.email;

               sidebarContato.classList.add('active');

            } catch (erro) { console.error('Erro ao buscar contato:', erro); }
        });
    }

    fecharContato.addEventListener('click', () => {
        sidebarContato.classList.remove('active');
    });

});
