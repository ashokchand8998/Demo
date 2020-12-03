module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Postpa55",
    DB: "pro_tracker",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};