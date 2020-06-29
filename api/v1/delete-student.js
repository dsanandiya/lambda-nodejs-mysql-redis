const mysql = require("mysql");
const util = require("./utils");
const cache = require("./lib/rediscache");
const { connectDB } = require("../../config/db");
module.exports.handler = async (event) => {
  try {
    const studentId = decodeURIComponent(event.pathParameters.studentId);
    const response = await connectDB().then(async (connection) => {
      return new Promise((resolve, reject) => {
        const sql = "DELETE FROM `students` WHERE `id` = ?";
        connection.query({ sql, values: [studentId] }, function (err, result) {
          if (err) return reject(err);
          console.log("Successfully deleted user from db");
          var res = {
            statusCode: 204,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({message: 'successfully deleted'})
          };
          cache.clearCache(studentId);
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
