const { DataTypes } = require("sequelize");
const db = require("../db");

const buildList = db.define("build", { //Ask if I have to add the Parts Association here
    // selectCase: {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
    },
}
);

module.exports = buildList;