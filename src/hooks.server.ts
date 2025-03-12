import { encodeJWT } from "$lib/server/jwt";
import { closeWebSocketConnection, connectToWebSocketServer, getClient } from "$lib/server/ws";
import DarkMode from "$lib/widgets/DarkMode.svelte";
import { redirect, type Handle } from "@sveltejs/kit";
import { v4 } from "uuid";

export const handle: Handle = async ({ event, resolve }) => {   
    const session = event.cookies.get("sessionID"); 
    const client = getClient(session??"0");

    const renew = event.url.searchParams.get("renewToken");

    if (session && client && !renew) {
        event.locals.user = getClient(session)?.user;
    } else if ((event.url.href.includes("/app") && !event.url.href.includes("/app/login")) || renew) {
        if (renew) {
            closeWebSocketConnection(session??"0");
        }
        var id = v4();
        var sessionID = encodeJWT(id);
        event.cookies.set('sessionID', sessionID, { path: '/', httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", });
        await connectToWebSocketServer(sessionID, "wss://mirea.aco-avrora.ru/student/arm/", {
// "Connection": "Upgrade",
// "Pragma": "no-cache",
// "Cache-Control": "no-cache",
"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.15.2 Chrome/83.0.4103.122 Safari/537.36",
// "Upgrade": "websocket",
"Origin": "https://mirea.aco-avrora.ru",
// "Accept-Encoding": "gzip, deflate, br",
        });
        return redirect(307, "/app/login");
    }
    
    return resolve(event);
}