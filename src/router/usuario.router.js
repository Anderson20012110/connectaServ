import express from 'express';
import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import Usuario from '../models/usuario.js';
import bcrypt from 'bcrypt';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const urlencodedParser = bodyParser.urlencoded({extended: true});   // Para desencriptar o POST


// GET Carrega o home.html
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public/home.html')) });

// Rota home usuário
router.get('/homeCliente', (req, res) => { res.sendFile(path.join(__dirname, '../public/homeUsuario.html')) });

// Rota home colaborador
router.get('/homeColaborador', (req, res) => { res.sendFile(path.join(__dirname, '../public/homeColaborador.html')) })

// GET Carrega o cadastro.html
router.get('/cadastro', async (req, res) => { res.sendFile(path.join(__dirname, '../public/cadastro.html')); });

// GET Carrega o login.html
router.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '../public/login.html')) });

// GET dados do usuário logado
router.get('/usuario-logado', (req, res) => {
    if(!req.session.usuario){ return res.status(401).json({ erro: 'Não autenticado' }); }
    res.json(req.session.usuario);
});


// POST Envia dados do form cadastro
router.post('/cadastrar', urlencodedParser, async (req, res) => { 
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
        res.redirect('/cadastro');
        
    } catch (error) {
        console.error(error);
        res.send('Erro ao cadastrar produto');
    }
});

// POST login
router.post('/login', urlencodedParser,  (req, res) => {

    Usuario.findOne({
            where: {
                email: req.body.email
            }

    }).then((usuario) => {
                
        if( !usuario ) { return res.send('Usuário não encontrado') }

        // validando com o bcrypt
        const senhaCriptografada =  bcrypt.compare( req.body.senha, usuario.senha)
        if( !senhaCriptografada ) { return res.send('Senha Incorreta') }

        // Salvando os dados do usuario
        req.session.usuario = { nome: usuario.nome, perfil: usuario.perfil };

        if( usuario.perfil === "cliente" ) { return res.redirect('/homeCliente') }
        if( usuario.perfil === "prestador" ) { return res.redirect('/homeColaborador') }

        res.send('Perfil de usuário inválido');

    }).catch ((error)=> {
        console.error(error);
        res.status(500).send('Erro interno no servidor ao tentar logar');
    });
    

});

export default router;