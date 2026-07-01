import express from 'express';  
import { Router } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

import Usuario from '../models/usuario.models.js'
import Prestador from '../models/prestador.models.js';
import ServicoPrestador from '../models/servicoPrestador.models.js';
import Favorito from '../models/favoritos.models.js';
import PerfilUsuario from '../models/perfilUsuario.models.js';
import verificarAutenticacao from '../middleware/verificarAutentucacao.middleware.js'
import upload from '../middleware/upload.middleware.js';


const route = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});   // Para desencriptar o POST

// Rotas GETs
route.get('/', async (req, res) => {

    try {

        const prestadores = await Prestador.findAll({
            include: [Usuario, ServicoPrestador]
        });

        res.render('home', {
            prestadores
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro ao carregar prestadores');

    }

});
route.get('/homeLogado', async (req, res) => {

    try {

        const prestadores = await Prestador.findAll({
            include: [Usuario, ServicoPrestador]
        });

        res.render('homeLogado', {
            prestadores
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('Erro ao carregar prestadores');

    }

});

route.get('/chat', verificarAutenticacao, (req, res) => { res.render('chat'); });
route.get('/buscar', verificarAutenticacao, (req, res) => { res.render('search'); });
route.get('/historico', verificarAutenticacao, (req, res) => { res.render('historico'); });
route.get('/login', (req, res) => { res.render('login'); });
route.get('/cadastro', (req, res) => { res.render('cadastro'); });
route.get('/dashboard', verificarAutenticacao, (req, res) => { res.render('dashboard'); });    

route.get('/perfilLogado', verificarAutenticacao, async (req, res) => { 
    try {
        const usuarioId = req.session.usuario.id;
        const usuario = await Usuario.findByPk(usuarioId);
        
        let prestador = null;
        let perfilUsuario = null;

        if (usuario.perfil === 'prestador') {
            prestador = await Prestador.findOne({
                where: { usuario_id: usuarioId },
                include: [Usuario, ServicoPrestador]
            });
        } else {
            perfilUsuario = await PerfilUsuario.findOne({
                where: { usuario_id: usuarioId },
                include: [Usuario]
            });
        }

        res.render('perfilLogado', { prestador, perfilUsuario, usuarioLogado: req.session.usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar perfil');
    }
});

route.get('/perfil', verificarAutenticacao, async (req, res) => { 
    try {
        const usuarioId = req.session.usuario.id;
        const usuario = await Usuario.findByPk(usuarioId);
        
        let prestador = null;
        let perfilUsuario = null;

        if (usuario.perfil === 'prestador') {
            prestador = await Prestador.findOne({
                where: { usuario_id: usuarioId },
                include: [Usuario, ServicoPrestador]
            });
        } else {
            perfilUsuario = await PerfilUsuario.findOne({
                where: { usuario_id: usuarioId },
                include: [Usuario]
            });
        }

        res.render('profile', { prestador, perfilUsuario, usuarioLogado: req.session.usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar perfil');
    }
});

route.get('/perfil/:id', verificarAutenticacao, async (req, res) => {
    try {
        const prestador = await Prestador.findByPk(req.params.id, {
            include: [Usuario, ServicoPrestador]
        });

        if (!prestador) {
            return res.status(404).send('Prestador não encontrado');
        }

        res.render('profile', { prestador, perfilUsuario: null, usuarioLogado: req.session.usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar perfil do prestador');
    }
});

route.get('/cadastroPrefilUsuario', verificarAutenticacao, (req, res) => { res.render('cadastroPrefilUsuario'); });
route.get('/cadastroPerfilColaborador', verificarAutenticacao, (req, res) => { res.render('cadastroPerfilColaborador'); });
route.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});
route.get('/favoritos', verificarAutenticacao, async (req,res) => {

    const favoritos = await Favorito.findAll({

        where:{
            cliente_id:req.session.usuario.id
        },

        include:[
            {
                model: Prestador,
                include:[Usuario]
            }
        ]

    });

    res.json(favoritos);

});


// Rotas POSTs
route.post('/cadastrar', urlencodedParser, async (req, res) => { 
    const emailExistente = await Usuario.findOne({
        where: {
            email: req.body.email
        }
    });

    if ( emailExistente ) { return res.send('E-mail já cadastrado') }

    const senhaHash = await bcrypt.hash( req.body.senha, 10 );          // Para criptografar a senha no BD  

    try {
        await Usuario.create({
            perfil: req.body.account_type,
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: senhaHash  
        });
        res.render('cadastro');
        
    } catch (error) {
        console.error(error);
        res.send('Erro ao cadastrar produto');
    }
});

route.post('/login', urlencodedParser, async (req, res) => {

Usuario.findOne({ where: { email: req.body.email } }).then(async (usuario) => { 
                
        if( !usuario ) { return res.send('Usuário não encontrado') }

        // validando com o bcrypt
        const senhaCriptografada = await bcrypt.compare( req.body.senha, usuario.senha)
        if( !senhaCriptografada ) { return res.send('Senha Incorreta') }

        let foto_perfil = null;
        if (usuario.perfil === "prestador") {
            const prestador = await Prestador.findOne({ where: { usuario_id: usuario.codigo } });
            if (prestador) foto_perfil = prestador.foto_perfil;
        } else if (usuario.perfil === "cliente") {
            const perfilUsuario = await PerfilUsuario.findOne({ where: { usuario_id: usuario.codigo } });
            if (perfilUsuario) foto_perfil = perfilUsuario.foto_perfil;
        }

        // Salvando os dados corretos do usuario
        req.session.usuario = { 
            id: usuario.codigo,
            nome: usuario.nome, 
            perfil: usuario.perfil,
            foto_perfil: foto_perfil
        };

        // Redirecionamento de login
        if( usuario.perfil === "cliente" || usuario.perfil === "prestador") {  
            return res.redirect('/homeLogado');

        // } else if( usuario.perfil === "prestador" ) { 
        //     return res.redirect('/homeColaborador');

        } else {
            res.status(401).send('Usuário ou senha inválidos.');
        }

    }).catch ((error)=> {
        console.error(error);
        res.status(500).send('Erro interno no servidor ao tentar logar');
    });

});

route.post('/cadastro-prestador', upload.fields([{ name: 'foto_perfil', maxCount: 1 }, { name: 'portfolio_midias', maxCount: 10 }]), async (req,res) => {

    try {

        const portfolioFilenames = req.files && req.files['portfolio_midias'] 
            ? req.files['portfolio_midias'].map(f => f.filename) 
            : [];

        const prestador = await Prestador.create({

            usuario_id: req.session.usuario.id,

            documento: req.body.documento,
            categoria: req.body.categoria,
            cargo: req.body.cargo,
            bio: req.body.bio,

            cep: req.body.cep,
            cidade: req.body.cidade,
            estado: req.body.estado,

            raio: req.body.raio,

            preco_base: req.body.preco_base,

            pix: req.body.pixCarteira,
            
            foto_perfil: req.files && req.files['foto_perfil'] ? req.files['foto_perfil'][0].filename : null,

            portfolio_midias: portfolioFilenames.length > 0 ? JSON.stringify(portfolioFilenames) : null
        });

        const nomes = req.body.servico_nome || [];
        const valores = req.body.servico_valor || [];

        for(let i = 0; i < nomes.length; i++){

            if(nomes[i] && valores[i]){

                await ServicoPrestador.create({

                    prestador_id: prestador.id,

                    nome: nomes[i],

                    valor: valores[i]
                });

            }
        }

        if (req.session.usuario && req.files && req.files['foto_perfil']) {
            req.session.usuario.foto_perfil = req.files['foto_perfil'][0].filename;
        }
        res.redirect('/homeLogado');

    } catch(error){

        console.error(error);

        res.status(500).send(
            'Erro ao cadastrar perfil profissional'
        );
    }
});

route.post('/cadastroPrefilUsuario', upload.single('foto_perfil'), verificarAutenticacao, async (req, res) => {
    try {
        const { 
            cpf, rg, dataNascimento, cep, estado, cidade, rua, bairro, numero, complemento 
        } = req.body;

        await PerfilUsuario.create({
            usuario_id: req.session.usuario.id,
            cpf,
            rg,
            dataNascimento,
            cep,
            estado,
            cidade,
            rua,
            bairro,
            numero,
            complemento,
            foto_perfil: req.file ? req.file.filename : null
        });

        if (req.session.usuario && req.file) {
            req.session.usuario.foto_perfil = req.file.filename;
        }
        res.redirect('/homeLogado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar perfil de usuário');
    }
});

route.post('/favoritar', async (req, res) => {

    const favoritoExistente = await Favorito.findOne({

        where: {
            cliente_id: req.session.usuario.id,
            prestador_id: req.body.prestador_id
        }

    });

    if (favoritoExistente) {

        return res.json({
            sucesso: false,
            mensagem: 'Já favoritado'
        });

    }

    const favorito = await Favorito.create({

        cliente_id: req.session.usuario.id,
        prestador_id: req.body.prestador_id

    });

    res.json({

        sucesso: true,
        favorito

    });

});



// Rota delete
route.delete('/favoritar/:id', async (req,res) => {

        await Favorito.destroy({

            where:{
                id:req.params.id
            }

        });

        res.json({
            sucesso:true
        });

});
route.delete('/favoritar/:prestadorId', async (req, res) => {

    try {

        await Favorito.destroy({

            where: {

                cliente_id: req.session.usuario.id,

                prestador_id: req.params.prestadorId

            }

        });

        res.json({

            sucesso: true

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false

        });

    }

});


export default route;