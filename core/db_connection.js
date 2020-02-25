const mysql = require('mysql');

const pool= mysql.createPool({
    connectionLimit: 10,
    password : '',
    user: 'root',
    database : 'airline_reservation',
    host:'localhost',
    port:'3306' 
});

module.exports=pool;