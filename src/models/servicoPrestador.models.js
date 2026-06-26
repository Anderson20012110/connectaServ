import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const ServicoPrestador = sequelize.define('ServicoPrestador', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    prestador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nome: DataTypes.STRING,

    valor: DataTypes.DECIMAL(10,2)

    },
    {
        tableName: 'servico_prestador',
        timestamps: true
    }
);

export default ServicoPrestador;