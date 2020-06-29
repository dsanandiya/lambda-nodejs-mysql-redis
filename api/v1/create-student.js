const util = require("./utils");
const { connectDB } = require("../../config/db");

module.exports.handler = async (event) => {
  try {
    const studentData = JSON.parse(event.body);
    const response = await connectDB().then(async (connection) => {
      return new Promise((resolve, reject) => {
        var sql = `INSERT INTO students (firstname, lastname, email, standard, created_at) VALUES ('${studentData.firstname}', '${studentData.lastname}', '${studentData.email}', ${studentData.standard}, NOW())`;
        connection.query(sql, function (err, result) {
          if (err) return reject(err);
          var res = {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({ message: "successfully created" }),
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
