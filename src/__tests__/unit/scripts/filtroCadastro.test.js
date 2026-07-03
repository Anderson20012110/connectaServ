/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Filtro Cadastro Script', () => {
    beforeEach(() => {
        // Mock window.alert
        window.alert = jest.fn();

        // Setup DOM
        document.body.innerHTML = `
            <form>
                <input type="tel" id="telefone" />
                <input type="password" id="senha" />
                <input type="password" id="confirmarSenha" />
                <button type="submit" id="submitBtn">Submit</button>
            </form>
        `;

        // Read and execute script
        const scriptPath = path.resolve(__dirname, '../../../../src/public/scripts/filtroCadastro.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Execute the script in current context
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);

        // Trigger DOMContentLoaded
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    it('should format telephone number', () => {
        const telefone = document.getElementById('telefone');
        
        telefone.value = '11999999999';
        telefone.dispatchEvent(new Event('input'));
        
        expect(telefone.value).toBe('(11) 99999-9999');
    });

    it('should show alert and prevent default if passwords do not match', () => {
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const form = document.querySelector('form');
        
        senha.value = '123456';
        confirmarSenha.value = '654321';

        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);

        expect(window.alert).toHaveBeenCalledWith('As senhas não coincidem.');
        expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('should show alert if password is too short', () => {
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const form = document.querySelector('form');
        
        senha.value = '12345';
        confirmarSenha.value = '12345';

        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);

        expect(window.alert).toHaveBeenCalledWith('A senha precisa ter no mínimo 6 caracteres.');
        expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('should show alert if telephone is incomplete', () => {
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const telefone = document.getElementById('telefone');
        const form = document.querySelector('form');
        
        senha.value = '123456';
        confirmarSenha.value = '123456';
        telefone.value = '(11) 9999-999'; // Incomplete

        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);

        expect(window.alert).toHaveBeenCalledWith('Digite um telefone válido.');
        expect(submitEvent.defaultPrevented).toBe(true);
    });
});
