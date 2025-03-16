import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function GET({ request, cookies }) {
    const session = cookies.get('sessionID')!;

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"getTaskList","arm_task_id":"${uuidv4()}","v":170}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}
