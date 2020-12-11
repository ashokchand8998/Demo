//model structure
module.exports = function (sequelize, Sequelize) {
    const Task = sequelize.define("task",  {
        title: {
            type: Sequelize.STRING
        },
        last_date: {
            type: Sequelize.DATEONLY
        },
        completed: {
            type: Sequelize.BOOLEAN
        },
        user_id : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    return Task;
}