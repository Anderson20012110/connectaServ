import { Sequelize } from "sequelize";

const sequelize = new Sequelize (

    'connectaserv_bd',
    'postgres',
    'postgres',
    
    {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432,
        logging: false
    }
);

export default sequelize;