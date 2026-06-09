
        const menuLateral = document.getElementById('ativarMenu');
        const menu = document.getElementById('menuLateral');

        menuLateral.addEventListener('click', function (event) {
            event.stopPropagation(); // impede que o clique chegue ao document
            menu.classList.toggle('ativo');
        });
        
        document.addEventListener('click', function (event) {
        
            const clicouNoMenu = menu.contains(event.target);
            const clicouNoAvatar = menuLateral.contains(event.target);
        
            if (!clicouNoMenu && !clicouNoAvatar) {
                menu.classList.remove('ativo');
            }
        });