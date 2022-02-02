const db = require('../db');

const UserModel = require("./user");
const BuildModel = require("./build");
const PartsModel = require("./parts");

UserModel.hasMany(BuildModel);
UserModel.hasMany(PartsModel);

BuildModel.belongsTo(UserModel);
BuildModel.hasMany(PartsModel);

PartsModel.belongsTo(BuildModel, {
    foreignKey: true,
    onDelete: "CASCADE"
});
    
module.exports = {
    dbConnection: db, models: {
        UserModel,
        BuildModel,
        PartsModel
    }
};