import { encodeJWT } from "$lib/server/jwt";
import { connectToWebSocketServer, getClient } from "$lib/server/ws";
import { redirect, type Handle } from "@sveltejs/kit";
import { v4 } from "uuid";

export const handle: Handle = async ({ event, resolve }) => {    
    const session = event.cookies.get("sessionID"); 
    const client = getClient(session??"0");

    if (session && client) {
        event.locals.user = getClient(session)?.user;
    } else if (event.url.href.includes("/app") && !event.url.href.includes("/app/login")) {
        var id = v4();
        var sessionID = encodeJWT(id);
        event.cookies.set('sessionID', sessionID, { path: '/', httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", });
        await connectToWebSocketServer(sessionID, "wss://mirea.aco-avrora.ru/student/arm/", {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
            "Origin": "https://mirea.aco-avrora.ru"
        });
        return redirect(307, "/app/login");
    }
    
    return resolve(event);
}