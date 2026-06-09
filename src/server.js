import express from 'express';
import routes from './router/usuario.router.js'
import sequelize from './config/database.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( session({ secret: 'connectaServ', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


// Configuração de autenticação sequeliz / database
sequelize.sync()
.then(() => { console.log('Banco conectado com sucesso.'); })
.catch((err) => { console.error('Erro ao conectar no banco:', err); });


app.listen(PORT, () => { console.log(`Servidor rodando em http://localhost:${PORT}`) })