const mysql = require("mysql");
const util = require("./utils");
const cache = require("./lib/rediscache");
const { connectDB } = require("../../config/db");
module.exports.handler = async (event) => {
  try {
    const studentId = decodeURIComponent(event.pathParameters.studentId);
    // check cached data
    let cachedData = await cache.getCache(studentId);
    if(cachedData) {
      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(JSON.parse(cachedData)),
      };
    }
   const response = await connectDB().then(async (connection) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `students` WHERE `id` = ?";
        connection.query({ sql, values: [studentId] }, (err, [student]) => {
          if (err) return reject(err);
          // add data into cache
          if(student) {
            cache.setCache(studentId, -1, student);
          }
          var res = {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(student),
          };
          resolve(res);
        });
        connection.release();
      });
    });
    return response;
  } catch (err) {
    console.log("Encountered an error:", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
