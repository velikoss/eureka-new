import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function GET({ request, cookies }) {
    const session = cookies.get('sessionID')!;

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"getTaskList","arm_task_id":"getTaskList_${uuidv4()}","v":190}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}
