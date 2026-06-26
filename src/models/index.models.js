import Usuario from './usuario.models.js';
import Prestador from './prestador.models.js';
import ServicoPrestador from './servicoPrestador.models.js';
import Favorito from './favoritos.models.js';
import PerfilUsuario from './perfilUsuario.models.js';

// Usuario -> PerfilUsuario
Usuario.hasOne(PerfilUsuario, {
    foreignKey: 'usuario_id',
    sourceKey: 'codigo'
});

PerfilUsuario.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    targetKey: 'codigo'
});

// Usuario -> Prestador
Usuario.hasOne(Prestador, {
    foreignKey: 'usuario_id',
    sourceKey: 'codigo'
});

Prestador.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    targetKey: 'codigo'
});

// Prestador -> Serviços
Prestador.hasMany(ServicoPrestador, {
    foreignKey: 'prestador_id'
});

ServicoPrestador.belongsTo(Prestador, {
    foreignKey: 'prestador_id'
});

Usuario.hasMany(Favorito,{
    foreignKey:'cliente_id',
    sourceKey:'codigo'
});

Favorito.belongsTo(Usuario,{
    foreignKey:'cliente_id',
    targetKey:'codigo'
});

Prestador.hasMany(Favorito,{
    foreignKey:'prestador_id'
});

Favorito.belongsTo(Prestador,{
    foreignKey:'prestador_id'
});

export {
    Usuario,
    Prestador,
    ServicoPrestador,
    PerfilUsuario
};