import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request, cookies }) {
    const session = cookies.get('sessionID')!;
    let _json = await request.text();

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":${_json},"ser_task":"saveTaskFile","arm_task_id":"saveTaskFile_${uuidv4()}","v":190}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}
