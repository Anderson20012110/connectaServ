import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.unstable_mockModule('../../../models/usuario.models.js', () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

jest.unstable_mockModule('../../../models/prestador.models.js', () => ({
    default: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    }
}));

jest.unstable_mockModule('../../../models/servicoPrestador.models.js', () => ({
    default: {
        create: jest.fn()
    }
}));

jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn()
    }
}));

describe('Usuario Routes', () => {
    let app;
    let route;
    let Usuario;
    let Prestador;
    let bcrypt;

    beforeAll(async () => {
        const routeModule = await import('../../../routes/usuario.route.js');
        route = routeModule.default;
        
        const usuarioModule = await import('../../../models/usuario.models.js');
        Usuario = usuarioModule.default;

        const prestadorModule = await import('../../../models/prestador.models.js');
        Prestador = prestadorModule.default;
        
        const bcryptModule = await import('bcrypt');
        bcrypt = bcryptModule.default;

        app = express();
        app.set('view engine', 'ejs');
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        // Mock session
        app.use((req, res, next) => {
            req.session = {
                destroy: jest.fn((cb) => cb(null))
            };
            next();
        });
        app.use('/', route);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET / should render home', async () => {
        Prestador.findAll.mockResolvedValueOnce([]);
        app.response.render = jest.fn().mockImplementation(function(view) {
            this.send(view);
        });

        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(app.response.render).toHaveBeenCalledWith('home', { prestadores: [] });
    });

    it('POST /cadastrar should fail if email exists', async () => {
        Usuario.findOne.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });
        
        const res = await request(app).post('/cadastrar').send({ email: 'test@test.com' });
        expect(res.text).toBe('E-mail já cadastrado');
    });

    it('POST /cadastrar should hash password and create user', async () => {
        Usuario.findOne.mockResolvedValueOnce(null);
        bcrypt.hash.mockResolvedValueOnce('hashed_password');
        Usuario.create.mockResolvedValueOnce({});
        
        app.response.render = jest.fn().mockImplementation(function(view) {
            this.send(view);
        });

        const res = await request(app).post('/cadastrar').send({ 
            email: 'new@test.com',
            senha: '123',
            nome: 'Test',
            telefone: '123',
            account_type: 'cliente'
        });
        
        expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
        expect(Usuario.create).toHaveBeenCalledWith({
            perfil: 'cliente',
            nome: 'Test',
            email: 'new@test.com',
            telefone: '123',
            senha: 'hashed_password'
        });
        expect(app.response.render).toHaveBeenCalledWith('cadastro');
    });
});
