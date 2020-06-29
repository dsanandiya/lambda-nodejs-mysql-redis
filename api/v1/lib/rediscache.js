const mysql = require('mysql');
const redis = require('redis');
const util = require('util');
const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);


exports.setCache = async (hashKey, time, data) => {
  return client.setex(hashKey, time, JSON.stringify(data));
}

exports.getCache = (hashKey) => {
  return new Promise((resolve, reject) => {
    client.get(hashKey, (err, result) => {
      if (err) {
          return reject(err);
      }
      resolve(result);
    });
  });
};

exports.clearCache = (hashKey) => {
  return client.del(hashKey);
}