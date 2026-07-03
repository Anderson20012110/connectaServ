import { jest } from '@jest/globals';
import { DataTypes } from 'sequelize';

jest.unstable_mockModule('../../../config/database.config.js', () => {
  return {
    default: {
      define: jest.fn().mockReturnValue({}),
    }
  };
});

describe('Usuario Model', () => {
  it('should define the Usuario model with correct fields', async () => {
    const db = await import('../../../config/database.config.js');
    const { default: Usuario } = await import('../../../models/usuario.models.js');
    
    expect(db.default.define).toHaveBeenCalledWith('Usuario', {
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false
      },
      perfil: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'usuario',
      timestamps: true
    });
  });
});
