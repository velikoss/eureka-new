import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    
    /**
     * Protecting the routes
    */
    if (event.url.href.includes("/app") && !event.url.href.includes("/app/login")) {
        event.cookies.get("sessionID");
    }
    return resolve(event);
}