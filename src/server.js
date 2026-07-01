import express from 'express';
import session from 'express-session';
import ConnectSessionSequelize from 'connect-session-sequelize';
import route from './routes/usuario.route.js';
import sequelize from './config/database.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import './models/index.models.js';
// import uuid from 'uuid';


const app = express();
const PORT = 3000;
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname(__filename);
// const uuid = crypto.randomUUID();

// Configuração do armazenamento de sessões no Sequelize
const SequelizeStore = ConnectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });


app.use(session({ 
    secret: '2C44-1T58-WFpQ350',
    store: sessionStore,                                        // Usa o banco de dados para não deslogar no restart
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false }      // Sessão expira em 1 dia
}));

sessionStore.sync();                                            // Sincroniza a tabela de sessões no banco de dados

// Carrega variável 'usuario' nos arquivo .ejs
app.use(( req, res, next) => { 
    res.locals.usuario = req.session.usuario || null; 
    next(); 
});

app.set('view engine', 'ejs');                                  // Definindo o views para carregar pg
app.set('views', './public/views');                             // Apontando a pasta views

app.use(express.json());                                        // Garante suporte a JSON nas requisições
app.use( express.static(path.join(__dirname, './public')));
app.use('/', route);


// Configuração de autenticação sequeliz / database
sequelize.sync({ alter: true })
.then(() => { console.log('Banco conectado com sucesso.'); })
.catch((err) => { console.error('Erro ao conectar no banco:', err); });


app.listen(PORT, () => { console.log(`Servidor rodando em http//:localhost:${PORT}`); })