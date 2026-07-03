import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const Favorito = sequelize.define(
    'Favorito',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        prestador_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'favorito',
        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ['cliente_id', 'prestador_id']
            }
        ]
    }
);

export default Favorito;