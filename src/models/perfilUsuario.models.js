import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'codigo'
        }
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rg: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cep: DataTypes.STRING,
    estado: DataTypes.STRING,
    cidade: DataTypes.STRING,
    rua: DataTypes.STRING,
    bairro: DataTypes.STRING,
    complemento: DataTypes.STRING,
    foto_perfil: DataTypes.STRING
}, {
    tableName: 'perfil_usuario',
    timestamps: true
});

export default PerfilUsuario;
