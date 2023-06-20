
import { promisePool, pusher } from "./db"

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return await get(req, res);
        case "POST":
            return await post(req, res);
        default:
            return res.status(400).send("Method not allowed");
    }
}

const get = async (req, res) => {
    let offset = req.query.offset ?? 0;
    offset = parseInt(offset);
    // console.log(offset);
    const [rows, fields] = await promisePool.query("SELECT * FROM message ORDER BY id DESC LIMIT 10 OFFSET ?", [offset]);
    // console.log(rows);
    return res.status(200).send(rows);
}

const post = async (req, res) => {
    // console.log(req.body);
    const response = await promisePool.query('INSERT INTO message (username, content) VALUES (?,?)',
        [req.body.username, req.body.content]);

    pusher.trigger("my-channel", "new-message", {
        username: req.body.username,
        content: req.body.content,
        created_at: new Date().toISOString()
    });

    return res.status(200).send(response);
};