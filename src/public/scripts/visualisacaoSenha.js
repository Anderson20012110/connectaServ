
    const campoSenha = document.getElementById('senha');
    const toggleSenha = document.getElementById('toggleSenha');

    toggleSenha.addEventListener('click', () => {
        if (campoSenha.type === 'password') {
            // Mostra a senha
            campoSenha.type = 'text';

            // Troca o ícone
            toggleSenha.classList.remove('fa-eye-slash');
            toggleSenha.classList.add('fa-eye');
        } else {
            // Oculta a senha
            campoSenha.type = 'password';

            // Retorna o ícone original
            toggleSenha.classList.remove('fa-eye');
            toggleSenha.classList.add('fa-eye-slash');
        }
    });
