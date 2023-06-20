
import mysql, { Connection } from 'mysql2';
import Pusher from 'pusher';


// const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1621639",
  key: "563763d076d7d2e2fe88",
  secret: "d1dfde04e678b80afa55",
  cluster: "ap1",
  useTLS: true
});


// const connection: Connection = mysql.createConnection('mysql://pdwf9ml30x3yldintr3z:pscale_pw_Ib6jUvQXucS2xC9AESboc5vBTTC5JPeyxUILXUurefP@aws.connect.psdb.cloud/simplechat?ssl={"rejectUnauthorized":true}');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone : 'UTC',      
    ssl: {
        "rejectUnauthorized": true
    }
});
const promisePool = pool.promise();

export { promisePool, pusher };