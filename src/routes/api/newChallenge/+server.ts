import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 } from 'uuid';

export async function GET({ cookies }) {
    const sessionID = cookies.get('sessionID');

    // Wrap the WebSocket communication in a Promise
    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(sessionID, `{"data":{},"ser_task":"newChallenge","arm_task_id":"newChallenge_${v4()}","v":170}`, (data) => {
            if (!data.success) {
                reject(data.error); // Handle any errors
            } else {
                resolve(data.data); // Resolve the promise with the response data
            }
        });
    });

    // Return the response as JSON
    return json({
        "response": response
    });
}
