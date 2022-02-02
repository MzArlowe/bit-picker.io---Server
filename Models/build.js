const { DataTypes } = require("sequelize");
const db = require("../db");

const buildList = db.define ("build", { //Ask if I have to add the Parts Association here
    // selectCase: {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
          },
        // id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true
        // },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }
);

module.exports = buildList;