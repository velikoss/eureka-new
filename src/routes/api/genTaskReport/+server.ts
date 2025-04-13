import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request, cookies }) {
    const session = cookies.get('sessionID')!;
    const { id } = await request.json();

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":${parseInt(id)},"ser_task":"genTaskReport","arm_task_id":"genTaskReport_${uuidv4()}","v":170}`, (data) => {
            resolve(data);
        });
    });
    return json(response);
}
