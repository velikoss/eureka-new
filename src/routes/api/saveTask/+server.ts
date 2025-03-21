import type { Task } from '$lib';
import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request, cookies }) {
    const session = cookies.get('sessionID')!;
    let _json = await request.json() as Task;
    _json.files = [];
    console.log(_json);

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"taskID":${_json.id}, "data":${JSON.stringify(_json)},"ser_task":"saveTaskFile","arm_task_id":"${uuidv4()}","v":170}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}
