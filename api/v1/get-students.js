const util = require("./utils");
const cache = require("./lib/rediscache");
const { connectDB } = require("../../config/db");
module.exports.handler = async (event) => {
  try {
    const redisListKey = 'student:studentList';
    // check cached data
    let cachedData = await cache.getCache(redisListKey);
    if(cachedData) {
      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(JSON.parse(cachedData)),
      };
    }

    const response = await connectDB().then(async (connection) => {
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM students", (err, students) => {
          if (err) return reject(err);
          // add data into cache
          if(students) {
            cache.setCache(redisListKey, 1800, students);
          }
          var res = {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(students),
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
