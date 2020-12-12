//initailizing sequelize
const Sequelize = require("sequelize");
let sequelize = null;


/*
*Creating connection to a database
*Sequelize(database_name, user, password, {.....})
*/
if(process.env.DATABASE_URL) {
    // for the application is running on Heroku ......
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false
    })
} else {
    //application is running on local machine
    const dbConfig = require("../config/db.config.js");

    sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host : dbConfig.HOST,
        dialect: dbConfig.dialect,
        //to prevent sequelize log out executed queries in console
        logging:false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    });

}


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//adding model/table to db while passing both sequelize and Sequelize as parameters
db.task = require("./task.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

//Setting relations/associations
db.user.hasMany(db.task, {
    foreignKey: 'user_id',
});
db.task.belongsTo(db.user, {
    foreignKey: 'user_id',
    onDelete: "cascade"
});

module.exports = db;