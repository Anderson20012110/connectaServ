import { jest } from '@jest/globals';
import verificarAutenticacao from '../../../middleware/verificarAutentucacao.middleware.js';

describe('Auth Middleware', () => {
  it('should call next if user is authenticated', () => {
    const req = { session: { usuario: { id: 1 } } };
    const res = {};
    const next = jest.fn();

    verificarAutenticacao(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should redirect to /login if session does not exist', () => {
    const req = {};
    const res = { redirect: jest.fn() };
    const next = jest.fn();

    verificarAutenticacao(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('should redirect to /login if user is not in session', () => {
    const req = { session: {} };
    const res = { redirect: jest.fn() };
    const next = jest.fn();

    verificarAutenticacao(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalled();
  });
});
