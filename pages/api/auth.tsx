
import { pusher } from "./db"

export default async function handler(req: any, res: any) {
    switch (req.method) {
        // case "GET":
        //     return await get(req, res);
        case "POST":
            return await post(req, res);
        default:
            return res.status(400).send("Method not allowed");
    }
}

const post = async (req: any, res: any) => {
    console.log(req.body);
    const { username, socket_id, channel_name } = req.body;
    // const socketId = req.body.socket_id;
    // const channel = req.body.channel_name;
    const presenceData = {
        user_id: username,
        user_info: { username: username },
    };
    // This authenticates every user. Don't do this in production!
    const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    res.send(authResponse);
};