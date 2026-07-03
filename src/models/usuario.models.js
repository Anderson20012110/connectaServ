import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const Usuario = sequelize.define('Usuario', {
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

export default Usuario;