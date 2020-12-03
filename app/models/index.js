//initailizing sequelize
const dbConfig = require("../config/db.config.js");

/*Creating connection to a database
*Sequelize(database_name, user, password, {.....})
*/
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host : dbConfig.HOST,
    dialect: dbConfig.dialect,
    //Using Sequelize without any aliases improves security
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//adding model/table to db while passing both sequelize and Sequelize as parameters
db.tasks = require("./tasks.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

//Setting relations/associations
db.users.hasMany(db.tasks, {
    foreignKey: 'user_id',
});
db.tasks.belongsTo(db.users, {
    foreignKey: 'user_id',
    onDelete: "cascade"
});

module.exports = db;