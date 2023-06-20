
import mysql, { Connection } from 'mysql2';
import Pusher from 'pusher';

const {
    APP_ID: APP_ID,
    KEY: KEY,
    SECRET: SECRET,
    CLUSTER: CLUSTER,
} = process.env;


// const channels = new Channels({
// });

const pusher = new Pusher({
    appId : APP_ID!,
    key : KEY!,
    secret : SECRET!,
    cluster : CLUSTER!,
    useTLS: true
});

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