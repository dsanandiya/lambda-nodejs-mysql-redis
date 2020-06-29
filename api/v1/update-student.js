const mysql = require("mysql");
const util = require("./utils");
const cache = require("./lib/rediscache");
const { connectDB } = require("../../config/db");
module.exports.handler = async (event) => {
  try {
    const studentData = JSON.parse(event.body);
    const studentId = decodeURIComponent(event.pathParameters.studentId);
    const response = await connectDB().then(async (connection) => {
      return new Promise((resolve, reject) => {
        const sql = "UPDATE `students` SET ? WHERE `id` = ?";
        connection.query(sql, [studentData, studentId], function (
          err,
          student
        ) {
          if (err) return reject(err);
          console.log("Successfully updated user");
          var res = {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({message: 'successfully updated'}),
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
