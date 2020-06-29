var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
  });

exports.connectDB = () => {
  return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
          if (err) {
              return reject(err);
          }
          resolve(connection);
      });
  });
};
