var Sequelize = require('sequelize');
var config = require('./config');

function connect () {
    var sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
}

return modules.exports = {
    connect : connect
};