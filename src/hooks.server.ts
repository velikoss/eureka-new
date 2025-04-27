import { encodeJWT } from "$lib/server/jwt";
import { closeWebSocketConnection, connectToWebSocketServer, getClient, sendMessageToWebSocketServer } from "$lib/server/ws";
import { redirect, type Handle } from "@sveltejs/kit";
import { v4 } from "uuid";

export const handle: Handle = async ({ event, resolve }) => {   
    const session = event.cookies.get("sessionID"); 
    const client = getClient(session??"0");

    console.log(event.url)

    const renew = event.url.searchParams.get("renewToken") || event.url.searchParams.get("re");

    if (session && client && client.user && !renew) {
        event.locals.user = getClient(session)?.user;
    } else if ((event.url.href.includes("/app") && !event.url.href.includes("login")) || renew) {
        if (renew) {
            // console.log("Requested renew"); 
            closeWebSocketConnection(session??"0");
        }
        var id = v4();
        var sessionID = encodeJWT(id);
        event.cookies.set('sessionID', sessionID, { path: '/', httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", });
        await connectToWebSocketServer(sessionID, "ws://77.110.105.188:8080", {
// "Connection": "Upgrade",
// "Pragma": "no-cache",
// "Cache-Control": "no-cache",
// "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 QtWebEngine/5.15.2 Chrome/83.0.4103.122 Firefox/133.0",
// "Upgrade": "websocket",
// "Origin": "https://mirea.aco-avrora.ru",
// "Accept-Encoding": "gzip, deflate, br",
        });
        // const response = await new Promise((resolve) => {
        //     sendMessageToWebSocketServer(sessionID, `{"data":{},"ser_task":"getStudentArmVersion","arm_task_id":"${v4()}","v":170}`, (data) => {
        //         resolve(data.data)
        //     });
        // });
        return redirect(307, "/app/login");
    }
    
    return resolve(event);
}
