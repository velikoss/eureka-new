import { getClient, sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 } from 'uuid';

export async function GET({ cookies }) {
    const sessionID = cookies.get('sessionID');

    let client = getClient(sessionID);
    // Return the response as JSON
    return json({
        "response": client
    });
}
