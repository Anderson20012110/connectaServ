import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const Prestador = sequelize.define('Prestador', {

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

    documento: {
        type: DataTypes.STRING,
        allowNull: false
    },

    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },

    cargo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    bio: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    cep: DataTypes.STRING,

    cidade: DataTypes.STRING,

    estado: DataTypes.STRING,

    raio: DataTypes.INTEGER,

    preco_base: DataTypes.DECIMAL(10,2),

    // pix: DataTypes.STRING,

    foto_perfil: DataTypes.STRING,

    portfolio_midias: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: 'prestador',
        timestamps: true
    }
);

export default Prestador;