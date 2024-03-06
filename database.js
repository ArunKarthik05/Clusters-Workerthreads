const mysql = require('mysql2');
require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize( process.env.DATABASE_NAME ,process.env.MYSQL_USER,  process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql', 
});

async function createSqlConnection(){
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}

const connection = mysql.createPool({
    port:3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME ,
    authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.MYSQL_PASSWORD + '\0'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}
});

if(connection){
  console.log("Connected to MySQL")
  createSqlConnection()

}else{
  console.log("Error connecting to mysql")
}

module.exports = {
  connection,
  sequelize
};