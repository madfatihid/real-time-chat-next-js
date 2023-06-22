
import { promisePool, pusher } from "./db"
// import Channels from 'pusher';


// const {
//     APP_ID: APP_ID,
//     KEY: KEY,
//     SECRET: SECRET,
//     CLUSTER: CLUSTER,
// } = process.env;


// const channels = new Channels({
//     appId : APP_ID,
//     key : KEY,
//     secret : SECRET,
//     cluster : CLUSTER,
//     useTLS: true
// });

export default async function handler(req : any, res : any) {
    switch (req.method) {
        case "GET":
            return await get(req, res);
        case "POST":
            return await post(req, res);
        default:
            return res.status(400).send("Method not allowed");
    }
}

const get = async (req : any, res : any) => {
    let offset = req.query.offset ?? 0;
    offset = parseInt(offset);
    // console.log(offset);
    const [rows, fields] = await promisePool.query("SELECT * FROM message ORDER BY id DESC LIMIT 10 OFFSET ?", [offset]);
    // console.log(rows);
    return res.status(200).send(rows);
}

const post = async (req : any, res : any) => {
    // console.log(req.body);
    const response = await promisePool.query('INSERT INTO message (username, content) VALUES (?,?)',
        [req.body.username, req.body.content]);
    // pusher.trigger("my-channel", "new-message", {
    //     username: req.body.username,
    //     content: req.body.content,
    //     created_at: new Date().toISOString()
    // }, () => {
    //     return res.status(200).send(response);
    // });
    pusher.trigger("my-channel", "new-message", {
        username: req.body.username,
        content: req.body.content,
        created_at: new Date().toISOString()
    }), () => {
        return res.status(200).send(response);
    };

    // return res.status(200).send(response);
};