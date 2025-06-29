const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306, // default MariaDB port
  user: 'root',
  password: '', // no psswd
  database: 'service_desk',
  connectionLimit: 5
});

console.log("MariaDB connection pool created.");

module.exports = pool;