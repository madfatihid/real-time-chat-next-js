
import { promisePool, pusher } from "./db"

// export default async function handler(req: any, res: any) {
//     switch (req.method) {
//         // case "GET":
//         //     return await get(req, res);
//         case "POST":
//             return await post(req, res);
//         default:
//             return res.status(400).send("Method not allowed");
//     }
// }

// const post = async (req: any, res: any) => {
//     pusher.trigger("my-channel", `${req.body.type}-typing`, {
//         username: req.body.username
//     }), () => {
//         return res.status(200);
//     };
// };